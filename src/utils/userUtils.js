import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Normalize a canteen name to a canonical form.
 */
export const normalizeCanteen = (name) => {
    if (!name) return '';
    let n = name.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    const aliasMap = {
        'four corner': 'fourth corner',
        'fourth corner': 'fourth corner',
        's block': 's block',
        'canteen 1': 's block',
        'unit 1': 's block',
        'unit 3': 'unit 3',
        'unit 3 fabeats': 'unit 3 fabeats',
        'unit 3fabeats': 'unit 3 fabeats',
        'unit 1 yummy tummy': 'yummy tummy',
        'yummy tummy': 'yummy tummy',
        'central mess': 'central mess',
        'bakery': 'bakery',
        'rvs canteen': 'rvs canteen',
    };
    n = n.replace(/^unit\s*-?\s*\d+\s+(yummy tummy.*)$/, '$1');
    n = n.replace(/^unit\s*-?\s*(\d+)\s+fabeats$/, 'unit $1 fabeats');
    return aliasMap[n] || n;
};

/**
 * Handle PDF download for sales reports.
 */
export const handleDownloadPDF = (reportEntries, userCanteen, reportDuration) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("SALES REPORT", 14, 20);
    doc.setFontSize(14);
    doc.text(`Canteen: ${userCanteen.toUpperCase()}`, 14, 30);
    doc.text(`Duration: ${reportDuration}`, 14, 40);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 50);

    const tableData = reportEntries.map(entry => [
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

    doc.save(`Report_${userCanteen}_${reportDuration.replace(/ /g, '_')}.pdf`);
};

/**
 * Handle Excel download for sales reports.
 */
export const handleDownloadExcel = (reportEntries, userCanteen, reportDuration) => {
    const data = reportEntries.map(entry => ({
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
    XLSX.writeFile(wb, `Report_${userCanteen}_${reportDuration.replace(/ /g, '_')}.xlsx`);
};
