import React, { useState, useMemo } from 'https://aistudiocdn.com/react@^19.2.0';
import { RekapData, SortConfig } from '../types.ts';

interface RekapTableProps {
    rekapData: RekapData[];
    categories: string[];
}

const SortIndicator: React.FC<{ active: boolean; direction: 'ascending' | 'descending' }> = ({ active, direction }) => {
    if (!active) return <span className="text-gray-400">↕️</span>;
    return <span className="text-[var(--color-primary)]">{direction === 'ascending' ? '↑' : '↓'}</span>;
};

const RekapTable: React.FC<RekapTableProps> = ({ rekapData, categories }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig<RekapData> | null>({ key: 'nama', direction: 'ascending' });

    const sortedRekapData = useMemo(() => {
        let sortableItems = [...rekapData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue: string | number;
                let bValue: string | number;

                if (sortConfig.key === 'nama') {
                    aValue = a.nama;
                    bValue = b.nama;
                } else if (sortConfig.key === 'total') {
                    aValue = a.total;
                    bValue = b.total;
                } else {
                    aValue = a.categories[sortConfig.key as string] || 0;
                    bValue = b.categories[sortConfig.key as string] || 0;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [rekapData, sortConfig]);

    const requestSort = (key: keyof RekapData | 'total' | string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const formatCurrency = (amount: number) => {
        if (!amount || amount === 0) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="bg-[var(--color-surface)] rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-[var(--color-border)]">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Rekap Keuangan per Siswa</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                    <thead className="bg-[var(--color-background)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider cursor-pointer hover:bg-[var(--color-border)] transition-colors" onClick={() => requestSort('nama')}>
                                <div className="flex items-center gap-1">Nama <SortIndicator active={sortConfig?.key === 'nama'} direction={sortConfig?.direction || 'ascending'} /></div>
                            </th>
                            {categories.map(cat => (
                                <th key={cat} className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider cursor-pointer hover:bg-[var(--color-border)] transition-colors" onClick={() => requestSort(cat)}>
                                    <div className="flex items-center gap-1">{cat} <SortIndicator active={sortConfig?.key === cat} direction={sortConfig?.direction || 'ascending'} /></div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider cursor-pointer hover:bg-[var(--color-border)] transition-colors" onClick={() => requestSort('total')}>
                                <div className="flex items-center gap-1">Total <SortIndicator active={sortConfig?.key === 'total'} direction={sortConfig?.direction || 'ascending'} /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
                        {sortedRekapData.length === 0 ? (
                            <tr>
                                <td colSpan={categories.length + 3} className="px-6 py-8 text-center text-[var(--color-text-secondary)]">Belum ada data untuk direkap.</td>
                            </tr>
                        ) : (
                            sortedRekapData.map((rekap, index) => (
                                <tr key={rekap.nama} className="hover:bg-[var(--color-background)]">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)] font-medium">{rekap.nama}</td>
                                    {categories.map(cat => (
                                        <td key={cat} className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{formatCurrency(rekap.categories[cat] || 0)}</td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[var(--color-primary)]">{formatCurrency(rekap.total)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RekapTable;