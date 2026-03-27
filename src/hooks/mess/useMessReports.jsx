import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const useMessReports = ({ productionRecords, salesData, returnItems, globalProductionUnit, formatLocation }) => {
    const [reportSubTab, setReportSubTab] = useState('daily-production');
    const [timeFilter, setTimeFilter] = useState('1-day');
    const [reportSearchItem, setReportSearchItem] = useState('');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const getMultiplier = useCallback(() => {
        if (timeFilter === '1-week') return 7;
        if (timeFilter === '1-month') return 30;
        if (timeFilter === '1-year') return 365;
        if (timeFilter === 'custom-range' && customStartDate && customEndDate) {
            const diff = new Date(customEndDate) - new Date(customStartDate);
            return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
        }
        return 1;
    }, [timeFilter, customStartDate, customEndDate]);

    const getDailyReportData = useCallback(() => {
        const start = customStartDate ? new Date(customStartDate) : null;
        const end = customEndDate ? new Date(customEndDate) : null;

        const filteredProduction = productionRecords.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(reportSearchItem.toLowerCase());
            if (!matchesSearch) return false;

            // CRITICAL: Filter by the current production unit
            if (r.productionUnit && r.productionUnit.toLowerCase() !== globalProductionUnit.toLowerCase()) return false;

            const recordDate = new Date(r.date);
            if (timeFilter === 'custom-range') {
                if (start && recordDate < start) return false;
                if (end && recordDate > end) return false;
            } else if (timeFilter === '1-day') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (recordDate < today) return false;
            }
            return true;
        });

        const grouped = {};
        filteredProduction.forEach(r => {
            const key = `${r.name}-${r.productionUnit}`;
            if (!grouped[key]) {
                grouped[key] = {
                    date: r.date,
                    item: r.name,
                    productionUnit: r.productionUnit,
                    produced: 0,
                    sales: { canteen1: 0, canteen2: 0, canteen3: 0, canteen4: 0 },
                    unsold: 0
                };
            }
            grouped[key].produced += r.qty;
        });

        Object.values(grouped).forEach(data => {
            const relevantSales = salesData.filter(s =>
                s.name === data.item &&
                formatLocation(s.location) === formatLocation(data.productionUnit)
            );
            relevantSales.forEach(s => {
                const loc = formatLocation(s.location);
                if (loc === 'S Block') data.sales.canteen1 += s.quantity;
                else if (loc === 'Fourth Corner') data.sales.canteen2 += s.quantity;
                else if (loc === 'Unit 3') data.sales.canteen3 += s.quantity;
                else if (loc === 'Unit 3 Fabeats') data.sales.canteen4 += s.quantity;
            });

            const totalSales = data.sales.canteen1 + data.sales.canteen2 + data.sales.canteen3 + data.sales.canteen4;
            data.unsold = Math.max(0, data.produced - totalSales);
        });

        return Object.values(grouped);
    }, [productionRecords, reportSearchItem, timeFilter, customStartDate, customEndDate, salesData, formatLocation]);

    const getReturnReportData = useCallback(() => {
        const filteredReturns = returnItems.filter(r =>
            r.item.toLowerCase().includes(reportSearchItem.toLowerCase()) &&
            r.status === 'Accepted' &&
            r.to && r.to.toLowerCase() === globalProductionUnit.toLowerCase()
        );

        const grouped = {};
        filteredReturns.forEach(r => {
            const key = `${r.date}-${r.item}`;
            if (!grouped[key]) {
                grouped[key] = {
                    date: r.date,
                    item: r.item,
                    totalReturn: 0,
                    breakdown: { canteen1: 0, canteen2: 0, canteen3: 0, canteen4: 0 },
                    primaryReason: r.reason || 'Unsold',
                    status: 'Accepted'
                };
            }
            grouped[key].totalReturn += r.qty;
            const from = formatLocation(r.from);
            if (from === 'S Block') grouped[key].breakdown.canteen1 += r.qty;
            else if (from === 'Fourth Corner') grouped[key].breakdown.canteen2 += r.qty;
            else if (from === 'Unit 3') grouped[key].breakdown.canteen3 += r.qty;
            else if (from === 'Unit 3 Fabeats') grouped[key].breakdown.canteen4 += r.qty;
        });

        return Object.values(grouped);
    }, [returnItems, reportSearchItem, formatLocation]);

    const getDemandReportData = useCallback(() => {
        const allData = [
            { canteen: 'S Block', topItem: 'SAMOSA', category: 'SNACKS', totalConsumed: 450, avgDaily: 15, trend: 'Increasing' },
            { canteen: 'Fourth Corner', topItem: 'COLD COFFEE', category: 'COOLDRINKS', totalConsumed: 320, avgDaily: 12, trend: 'Stable' },
            { canteen: 'Unit 3', topItem: 'VEG PUFF', category: 'SNACKS', totalConsumed: 280, avgDaily: 10, trend: 'Increasing' },
            { canteen: 'Unit 3 Fabeats', topItem: 'PEPSI', category: 'COOLDRINKS', totalConsumed: 520, avgDaily: 18, trend: 'Very High' }
        ];

        const filtered = allData.filter(d => 
            formatLocation(d.canteen).toLowerCase() === formatLocation(globalProductionUnit).toLowerCase()
        );

        if (filtered.length > 0) return filtered;

        // Fallback row for currently selected unit if not in mock data
        return [{
            canteen: formatLocation(globalProductionUnit),
            topItem: 'N/A',
            category: 'N/A',
            totalConsumed: 0,
            avgDaily: 0,
            trend: 'Stable'
        }];
    }, [globalProductionUnit, formatLocation]);

    const handleDownloadExcel = () => {
        let dataToExport = [];
        let filename = `Report_${reportSubTab}_${new Date().toLocaleDateString()}.xlsx`;

        if (reportSubTab === 'daily-production') {
            dataToExport = getDailyReportData().map(row => ({
                Date: row.date,
                Item: row.item,
                'Production Unit': row.productionUnit,
                'Total Produced': row.produced,
                'S Block Sales': row.sales.canteen1,
                'Fourth Corner Sales': row.sales.canteen2,
                'Unit 3 Sales': row.sales.canteen3,
                'Unit 3 Fabeats Sales': row.sales.canteen4,
                'Unsold/Returned': row.unsold
            }));
        } else if (reportSubTab === 'wastage') {
            dataToExport = getReturnReportData().map(row => ({
                Date: row.date,
                Item: row.item,
                'Total Return': row.totalReturn,
                'S Block': row.breakdown.canteen1,
                'Fourth Corner': row.breakdown.canteen2,
                'Unit 3': row.breakdown.canteen3,
                'Unit 3 Fabeats': row.breakdown.canteen4,
                Reason: row.primaryReason
            }));
        }

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, filename);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const title = reportSubTab.split('-').map(w => w.toUpperCase()).join(' ');
        doc.setFontSize(18);
        doc.text(`MESS SYSTEM - ${title}`, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Unit: ${globalProductionUnit}`, 14, 36);

        let body = [];
        let head = [];

        if (reportSubTab === 'daily-production') {
            head = [['Date', 'Item', 'Unit', 'Produced', 'S Block', 'FC', 'U3', 'U3F', 'Unsold']];
            body = getDailyReportData().map(r => [
                r.date, r.item, r.productionUnit, r.produced,
                r.sales.canteen1, r.sales.canteen2, r.sales.canteen3, r.sales.canteen4,
                r.unsold
            ]);
        } else if (reportSubTab === 'wastage') {
            head = [['Date', 'Item', 'Total Return', 'S Block', 'FC', 'U3', 'U3F', 'Reason']];
            body = getReturnReportData().map(r => [
                r.date, r.item, r.totalReturn,
                r.breakdown.canteen1, r.breakdown.canteen2, r.breakdown.canteen3, r.breakdown.canteen4,
                r.primaryReason
            ]);
        }

        autoTable(doc, {
            head: head,
            body: body,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [40, 40, 40] }
        });

        doc.save(`Report_${reportSubTab}.pdf`);
    };

    return {
        reportSubTab, setReportSubTab,
        timeFilter, setTimeFilter,
        reportSearchItem, setReportSearchItem,
        customStartDate, setCustomStartDate,
        customEndDate, setCustomEndDate,
        handleDownloadExcel, handleDownloadPDF,
        getDailyReportData, getReturnReportData, getDemandReportData
    };
};
