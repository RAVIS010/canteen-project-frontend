import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import api from '../../api/axios';

export const useUserReports = ({ userCanteen, assignedCanteens }) => {
    const [reportDuration, setReportDuration] = useState('Today');
    const [reportSearchTerm, setReportSearchTerm] = useState('');
    const [reportStats, setReportStats] = useState({
        billsToday: 0,
        transferredToday: 0,
        returnedToday: 0
    });
    const [paymentStats, setPaymentStats] = useState({
        cash: 0,
        gpay: 0,
        complimentary: 0
    });
    const [reportEntries, setReportEntries] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState(null);

    const fetchReports = useCallback(async () => {
        try {
            const reportLocation = (assignedCanteens && assignedCanteens.length > 0)
                ? assignedCanteens.join(',')
                : userCanteen;

            const result = await api.get(`/reports/data?duration=${reportDuration}&location=${encodeURIComponent(reportLocation)}`);

            if (result.sales) {
                const entries = result.sales.map(sale => ({
                    date: new Date(sale.createdAt).toLocaleDateString(),
                    time: new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    name: sale.productName,
                    sold: sale.sold,
                    unsold: sale.unsold || 0,
                    price: sale.price,
                    paymentMode: sale.paymentMode || 'Cash'
                }));
                setReportEntries(entries);

                const pStats = entries.reduce((acc, entry) => {
                    const mode = (entry.paymentMode || 'Cash').toLowerCase();
                    if (mode === 'cash') acc.cash++;
                    else if (mode === 'gpay' || mode === 'g-pay') acc.gpay++;
                    else if (mode === 'complimentary') acc.complimentary++;
                    return acc;
                }, { cash: 0, gpay: 0, complimentary: 0 });
                setPaymentStats(pStats);
            }
            if (result.stats) {
                setReportStats(result.stats);
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
        }
    }, [reportDuration, userCanteen, assignedCanteens]);

    const handleDownloadPDF = (entries, location, duration) => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("SALES REPORT", 14, 20);
        doc.setFontSize(14);
        doc.text(`Canteen: ${location.toUpperCase()}`, 14, 30);
        doc.text(`Duration: ${duration}`, 14, 40);
        doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 50);

        const tableData = entries.map(entry => [
            entry.date,
            entry.time,
            entry.name,
            entry.sold,
            `Rs. ${entry.price}`,
            `Rs. ${entry.sold * entry.price}`,
            entry.paymentMode
        ]);

        autoTable(doc, {
            head: [['Date', 'Time', 'Item', 'Qty', 'Price', 'Total', 'Payment']],
            body: tableData,
            startY: 60,
            theme: 'striped',
            headStyles: { fillColor: [0, 0, 0] }
        });

        doc.save(`Report_${location}_${duration.replace(/ /g, '_')}.pdf`);
    };

    const handleDownloadExcel = (entries, location, duration) => {
        const data = entries.map(entry => ({
            'Date': entry.date,
            'Time': entry.time,
            'Item Name': entry.name,
            'Quantity Sold': entry.sold,
            'Unit Price': entry.price,
            'Total Amount': entry.sold * entry.price,
            'Payment Mode': entry.paymentMode
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
        XLSX.writeFile(wb, `Report_${location}_${duration.replace(/ /g, '_')}.xlsx`);
    };

    return {
        reportDuration, setReportDuration,
        reportSearchTerm, setReportSearchTerm,
        reportStats, setReportStats,
        paymentStats, setPaymentStats,
        reportEntries, setReportEntries,
        selectedMetric, setSelectedMetric,
        fetchReports,
        handleDownloadPDF,
        handleDownloadExcel
    };
};
