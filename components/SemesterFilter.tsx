import React from 'https://aistudiocdn.com/react@^19.2.0';
import { Semester } from '../types.ts';

interface SemesterFilterProps {
    selectedSemester: Semester;
    onSelectSemester: (semester: Semester) => void;
}

const SemesterFilter: React.FC<SemesterFilterProps> = ({ selectedSemester, onSelectSemester }) => {
    const semesters: { key: Semester, label: string }[] = [
        { key: 'all', label: 'Semua' },
        { key: '1', label: 'Semester 1' },
        { key: '2', label: 'Semester 2' }
    ];

    return (
        <div className="bg-[var(--color-surface)] rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Filter Semester</h2>
            <div className="flex flex-wrap gap-2">
                {semesters.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => onSelectSemester(key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedSemester === key
                                ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)]'
                                : 'bg-[var(--color-background)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SemesterFilter;