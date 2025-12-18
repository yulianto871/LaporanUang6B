
import React, { useState, useMemo, useEffect, useCallback } from 'https://aistudiocdn.com/react@^19.2.0';
import { INITIAL_CATEGORIES, STUDENT_NAMES } from './constants.js';
import { ThemeProvider, useTheme } from './contexts/ThemeContext.js';
import Header from './components/Header.js';
import ThemeSwitcher from './components/ThemeSwitcher.js';
import SemesterFilter from './components/SemesterFilter.js';
import TransactionForm from './components/TransactionForm.js';
import SummarySection from './components/SummarySection.js';
import RekapTable from './components/RekapTable.js';
import TransactionsTable from './components/TransactionsTable.js';
import Toast from './components/Toast.js';
import ExportPDFButton from './components/ExportPDFButton.js';

const AppContent = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [toast, setToast] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState('all');
    const { theme, font } = useTheme();

    useEffect(() => {
        document.body.style.backgroundColor = theme.colors.background;
        document.body.style.color = theme.colors.textPrimary;
    }, [theme]);

    const showToast = useCallback((message, type) => {
        setToast({ message, type });
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleAddTransaction = (transaction) => {
        if (transactions.length >= 999) {
            showToast('Batas maksimum 999 transaksi telah tercapai.', 'error');
            return;
        }
        const newTransaction = {
            ...transaction,
            id: Date.now().toString() + Math.random().toString(36).substring(2),
        };
        setTransactions(prev => [newTransaction, ...prev]);
        showToast('Transaksi berhasil ditambahkan!', 'success');
    };

    const handleDeleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
        showToast('Transaksi berhasil dihapus!', 'success');
    };

    const handleAddCategory = (category) => {
        if (category && !categories.includes(category)) {
            setCategories(prev => [...prev, category]);
            showToast(`Kategori "${category}" berhasil ditambahkan!`, 'success');
        }
    };

    const filteredTransactions = useMemo(() => {
        if (selectedSemester === 'all') return transactions;
        return transactions.filter(t => {
            const month = new Date(t.tanggal).getMonth();
            if (selectedSemester === '1') return month >= 6 && month <= 11;
            if (selectedSemester === '2') return month >= 0 && month <= 5;
            return true;
        });
    }, [transactions, selectedSemester]);
    
    const allCategoriesInUse = useMemo(() => {
        const uniqueCategories = new Set(filteredTransactions.map(t => t.kategori));
        return Array.from(uniqueCategories).sort();
    }, [filteredTransactions]);

    const summaryData = useMemo(() => {
        const totals = {};
        let grandTotal = 0;
        filteredTransactions.forEach(t => {
            if (!totals[t.kategori]) totals[t.kategori] = 0;
            totals[t.kategori] += t.jumlah;
            grandTotal += t.jumlah;
        });
        return { totals, grandTotal };
    }, [filteredTransactions]);

    const rekapData = useMemo(() => {
        const rekapMap = new Map();
        filteredTransactions.forEach(t => {
            let studentRekap = rekapMap.get(t.nama);
            if (!studentRekap) {
                studentRekap = { nama: t.nama, total: 0, categories: {} };
            }
            studentRekap.total += t.jumlah;
            studentRekap.categories[t.kategori] = (studentRekap.categories[t.kategori] || 0) + t.jumlah;
            rekapMap.set(t.nama, studentRekap);
        });
        return Array.from(rekapMap.values());
    }, [filteredTransactions]);

    return (
        <div className="min-h-full p-4 sm:p-6 transition-colors duration-300" style={{ fontFamily: font }}>
            <div className="max-w-7xl mx-auto">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                <Header title="LAPORAN KEUANGAN KELAS VI" subtitle="TAHUN AJARAN 2025/2026" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ThemeSwitcher />
                    <SemesterFilter selectedSemester={selectedSemester} onSelectSemester={setSelectedSemester} />
                </div>
                <main>
                    <TransactionForm
                        categories={categories}
                        studentNames={STUDENT_NAMES}
                        onAddTransaction={handleAddTransaction}
                        onAddCategory={handleAddCategory}
                    />
                    <SummarySection summaryData={summaryData} />
                    {filteredTransactions.length > 0 && (
                        <ExportPDFButton
                            transactions={filteredTransactions}
                            rekapData={rekapData}
                            allCategoriesInUse={allCategoriesInUse}
                            summaryData={summaryData}
                            selectedSemester={selectedSemester}
                        />
                    )}
                    <div className="space-y-6">
                        <RekapTable rekapData={rekapData} categories={allCategoriesInUse} />
                        <TransactionsTable transactions={filteredTransactions} onDeleteTransaction={handleDeleteTransaction} />
                    </div>
                </main>
                <footer className="mt-8 text-center">
                    <p className="text-[var(--color-text-secondary)]">Bendahara Kelas</p>
                </footer>
            </div>
        </div>
    );
};

const App = () => (
    <ThemeProvider>
        <AppContent />
    </ThemeProvider>
);

export default App;
