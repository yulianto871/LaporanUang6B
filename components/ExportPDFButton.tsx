import React from 'https://aistudiocdn.com/react@^19.2.0';
import { Transaction, RekapData, Semester } from '../types.ts';

declare global {
  interface Window {
    jspdf: {
      jsPDF: any; // The constructor class
    };
  }
}

interface ExportActionsProps {
  transactions: Transaction[];
  rekapData: RekapData[];
  allCategoriesInUse: string[];
  summaryData: {
    totals: { [key: string]: number };
    grandTotal: number;
  };
  selectedSemester: Semester;
}

const ExportActions: React.FC<ExportActionsProps> = ({ transactions, rekapData, allCategoriesInUse, summaryData, selectedSemester }) => {
    
    const formatCurrency = (amount: number) => {
        if (amount === 0) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };
    
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const getSemesterLabel = () => {
        return selectedSemester === '1' ? 'Semester 1' 
             : selectedSemester === '2' ? 'Semester 2' 
             : 'Semua Semester';
    };

    const handleExportPDF = () => {
        // More robust check for the jspdf object and the autotable plugin
        if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF.prototype.autoTable === 'undefined') {
            alert('Library PDF belum dimuat dengan benar. Silakan periksa koneksi internet Anda dan coba lagi.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const addFooters = () => {
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(9);
                doc.setTextColor(100);
                const text = `Halaman ${i} dari ${pageCount} | Dibuat pada: ${new Date().toLocaleString('id-ID')}`;
                const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
                doc.text(text, x, doc.internal.pageSize.getHeight() - 10);
            }
        };

        const semesterTitleText = `(${getSemesterLabel()})`;

        // Page 1: Title and Summary
        doc.setFontSize(18);
        doc.setTextColor(20, 20, 20);
        doc.text(`Laporan Keuangan Kelas VI ${semesterTitleText}`, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(120, 120, 120);
        doc.text('Tahun Ajaran 2025/2026', 14, 30);
        
        doc.autoTable({
            startY: 40,
            head: [['Kategori Pemasukan', 'Jumlah']],
            body: [
                ...Object.entries(summaryData.totals).map(([key, value]) => [key, formatCurrency(value as number)]),
            ],
            foot: [['Total Keseluruhan', formatCurrency(summaryData.grandTotal)]],
            theme: 'grid',
            headStyles: { fillColor: '#3b82f6', textColor: '#ffffff' },
            footStyles: { fillColor: '#f1f5f9', textColor: '#1e293b', fontStyle: 'bold' },
        });

        // Page 2: Rekap Table
        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(20, 20, 20);
        doc.text('Rekap Keuangan per Siswa', 14, 20);

        const rekapHead = [['No', 'Nama Siswa', ...allCategoriesInUse, 'Total']];
        const rekapBody = rekapData
            .sort((a,b) => a.nama.localeCompare(b.nama))
            .map((rekap, index) => [
                index + 1,
                rekap.nama,
                ...allCategoriesInUse.map(cat => rekap.categories[cat] ? formatCurrency(rekap.categories[cat]) : '-'),
                formatCurrency(rekap.total)
            ]);

        doc.autoTable({
            startY: 25,
            head: rekapHead,
            body: rekapBody,
            theme: 'striped',
            headStyles: { fillColor: '#3b82f6', textColor: '#ffffff' },
        });

        // Page 3: Transactions Table
        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(20, 20, 20);
        doc.text('Daftar Rincian Transaksi', 14, 20);

        const transactionsHead = [['No', 'Tanggal', 'Nama Siswa', 'Kategori', 'Jumlah', 'Keterangan']];
        const transactionsBody = [...transactions]
            .sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
            .map((t, index) => [
                index + 1,
                formatDate(t.tanggal),
                t.nama,
                t.kategori,
                formatCurrency(t.jumlah),
                t.keterangan || '-'
            ]);
        
        doc.autoTable({
            startY: 25,
            head: transactionsHead,
            body: transactionsBody,
            theme: 'striped',
            headStyles: { fillColor: '#3b82f6', textColor: '#ffffff' },
            columnStyles: { 5: { cellWidth: 'auto' } },
        });

        addFooters();
        doc.save(`Laporan_Keuangan_Kelas_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleExportHTML = () => {
        const sortedRekap = [...rekapData].sort((a, b) => a.nama.localeCompare(b.nama));
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
        
        const summaryCards = Object.entries(summaryData.totals).map(([key, value]) => `
            <div class="card">
                <div class="card-title">${key}</div>
                <div class="card-amount">${formatCurrency(value as number)}</div>
            </div>
        `).join('');

        const rekapRows = sortedRekap.map((rekap, index) => `
            <tr>
                <td>${index + 1}</td>
                <td class="font-medium">${rekap.nama}</td>
                ${allCategoriesInUse.map(cat => `<td>${rekap.categories[cat] ? formatCurrency(rekap.categories[cat]) : '-'}</td>`).join('')}
                <td class="font-bold">${formatCurrency(rekap.total)}</td>
            </tr>
        `).join('');

        const rekapHeaderCols = allCategoriesInUse.map(cat => `<th>${cat}</th>`).join('');

        const transactionRows = sortedTransactions.map((t, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${formatDate(t.tanggal)}</td>
                <td>${t.nama}</td>
                <td><span class="badge">${t.kategori}</span></td>
                <td>${formatCurrency(t.jumlah)}</td>
                <td>${t.keterangan || '-'}</td>
            </tr>
        `).join('');

        const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Keuangan Kelas VI</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background-color: #fff; color: #1e293b; }
        .container { max-width: 1100px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
        h1 { margin: 0 0 10px 0; color: #1e293b; font-size: 24px; }
        p.subtitle { margin: 0; color: #64748b; font-size: 16px; }
        h2 { margin-top: 40px; margin-bottom: 20px; color: #334155; border-left: 4px solid #3b82f6; padding-left: 12px; font-size: 20px; }
        
        /* Summary Grid */
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 40px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .card.total { background: #eff6ff; border-color: #bfdbfe; }
        .card-title { font-size: 12px; color: #64748b; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .card-amount { font-size: 20px; font-weight: bold; color: #0f172a; }
        .card.total .card-amount { color: #1d4ed8; }

        /* Tables */
        .table-wrapper { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; white-space: nowrap; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background-color: #f1f5f9; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
        tr:hover { background-color: #f8fafc; }
        tr:last-child td { border-bottom: none; }
        .font-medium { font-weight: 600; color: #334155; }
        .font-bold { font-weight: 700; color: #1e293b; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; background-color: #e0e7ff; color: #3730a3; }
        
        footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        
        @media print {
            body { padding: 0; }
            .container { max-width: 100%; }
            .card, .table-wrapper { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Laporan Keuangan Kelas VI</h1>
            <p class="subtitle">Tahun Ajaran 2025/2026 - ${getSemesterLabel()}</p>
        </header>

        <h2>Ringkasan Keuangan</h2>
        <div class="summary-grid">
            <div class="card total">
                <div class="card-title">Total Keseluruhan</div>
                <div class="card-amount">${formatCurrency(summaryData.grandTotal)}</div>
            </div>
            ${summaryCards}
        </div>

        <h2>Rekap Keuangan per Siswa</h2>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th width="50">No</th>
                        <th>Nama Siswa</th>
                        ${rekapHeaderCols}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${rekapRows.length > 0 ? rekapRows : '<tr><td colspan="100" style="text-align:center; padding: 20px;">Belum ada data.</td></tr>'}
                </tbody>
            </table>
        </div>

        <h2>Rincian Transaksi</h2>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th width="50">No</th>
                        <th>Tanggal</th>
                        <th>Nama Siswa</th>
                        <th>Kategori</th>
                        <th>Jumlah</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactionRows.length > 0 ? transactionRows : '<tr><td colspan="6" style="text-align:center; padding: 20px;">Belum ada transaksi.</td></tr>'}
                </tbody>
            </table>
        </div>

        <footer>
            Dicetak pada: ${new Date().toLocaleString('id-ID')}
        </footer>
    </div>
</body>
</html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mb-6 flex justify-end gap-3">
            <button
                onClick={handleExportHTML}
                className="bg-[var(--color-secondary)] text-[var(--color-text-on-primary)] px-4 py-2 rounded-md hover:bg-[var(--color-secondary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] transition-colors flex items-center gap-2 shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Ekspor ke HTML</span>
            </button>

            <button
                onClick={handleExportPDF}
                className="bg-[var(--color-primary)] text-[var(--color-text-on-primary)] px-4 py-2 rounded-md hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] transition-colors flex items-center gap-2 shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Ekspor ke PDF</span>
            </button>
        </div>
    );
};

export default ExportActions;