import React from 'https://aistudiocdn.com/react@^19.2.0';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { THEMES, FONTS } from '../theme.ts';
import { Font } from '../types.ts';

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme, font, setFont } = useTheme();
    const currentFontName = font.split(',')[0].replace(/"/g, '');

    return (
        <div className="bg-[var(--color-surface)] rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Tampilan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Skema Warna</h3>
                    <div className="flex flex-wrap gap-2">
                        {THEMES.map((t) => (
                            <button
                                key={t.name}
                                onClick={() => setTheme(t.name)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                    theme.name === t.name
                                        ? 'ring-2 ring-offset-2 ring-offset-[var(--color-surface)] ring-[var(--color-primary)] text-[var(--color-text-on-primary)]'
                                        : 'hover:opacity-80'
                                }`}
                                style={{
                                    backgroundColor: t.colors.primary,
                                    color: t.colors.textOnPrimary,
                                }}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="font-select" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Font</label>
                    <select
                        id="font-select"
                        value={currentFontName}
                        onChange={(e) => setFont(e.target.value as Font)}
                        className="w-full max-w-xs px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    >
                        {FONTS.map((f) => (
                            <option key={f} value={f} style={{fontFamily: `"${f}", sans-serif`}}>
                                {f}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ThemeSwitcher;