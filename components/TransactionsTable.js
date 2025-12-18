import React, { useState, useMemo } from 'https://aistudiocdn.com/react@^19.2.0';

const SortIndicator = ({ active, direction }) => {
    if (!active) return <span className="text-gray-400">↕️</span>;
    return <span className="text-[var(--color-primary)]">{direction === 'ascending' ? '↑' : '↓'}</span>;
};

const TransactionsTable = ({ transactions, onDeleteTransaction }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'tanggal', direction: 'descending' });

    const sortedTransactions = useMemo(() => {
        let sortableItems = [...transactions];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [transactions, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <div className="bg-[var(--color-surface)] rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)]">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Daftar Transaksi</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                    <thead className="bg-[var(--color-background)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">No</th>
                            {['nama', 'kategori', 'jumlah', 'tanggal'].map((key) => (
                                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider cursor-pointer hover:bg-[var(--color-border)] transition-colors" onClick={() => requestSort(key)}>
                                    <div className="flex items-center gap-1 capitalize">{key} <SortIndicator active={sortConfig?.key === key} direction={sortConfig?.direction} /></div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Keterangan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
                        {sortedTransactions.length === 0 ? (
                             <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-[var(--color-text-secondary)]">Belum ada transaksi.</td>
                            </tr>
                        ) : (
                            sortedTransactions.map((transaction, index) => (
                                <tr key={transaction.id} className="hover:bg-[var(--color-background)]">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{transaction.nama}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">{transaction.kategori}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)] font-medium">{formatCurrency(transaction.jumlah)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{formatDate(transaction.tanggal)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)] truncate max-w-xs">{transaction.keterangan || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => onDeleteTransaction(transaction.id)} className="text-red-600 hover:text-red-800 transition-colors">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsTable;