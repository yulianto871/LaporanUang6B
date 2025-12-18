import React from 'https://aistudiocdn.com/react@^19.2.0';

const SummaryCard = ({ title, amount, isTotal = false }) => {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

  return (
    <div className={`bg-[var(--color-surface)] rounded-lg shadow-md p-4 transition-transform hover:scale-105 ${isTotal ? 'border-2 border-[var(--color-primary)]' : ''}`}>
      <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1 truncate">{title}</h3>
      <p className={`text-2xl font-bold ${isTotal ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>{formattedAmount}</p>
    </div>
  );
};

const SummarySection = ({ summaryData }) => {
  const { totals, grandTotal } = summaryData;
  const sortedCategories = Object.keys(totals).sort();

  if (Object.keys(totals).length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {grandTotal > 0 && (
        <SummaryCard title="Total Keseluruhan" amount={grandTotal} isTotal />
      )}
      {sortedCategories.map(category => (
        <SummaryCard key={category} title={category} amount={totals[category]} />
      ))}
    </div>
  );
};

export default SummarySection;