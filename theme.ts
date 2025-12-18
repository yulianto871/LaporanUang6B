import { Theme, Font } from './types';

const defaultTheme: Theme = {
    name: 'Default',
    colors: {
        primary: '#3b82f6', // blue-500
        primaryHover: '#2563eb', // blue-600
        primaryLight: '#dbeafe', // blue-100
        primaryLightest: '#eff6ff', // blue-50
        primaryDark: '#1d4ed8', // blue-700
        secondary: '#16a34a', // green-600
        secondaryHover: '#15803d', // green-700
        background: '#f1f5f9', // slate-100
        surface: '#ffffff', // white
        border: '#e2e8f0', // slate-200
        textPrimary: '#1e293b', // slate-800
        textSecondary: '#64748b', // slate-500
        textOnPrimary: '#ffffff', // white
    },
};

const mintTheme: Theme = {
    name: 'Mint',
    colors: {
        primary: '#10b981', // emerald-500
        primaryHover: '#059669', // emerald-600
        primaryLight: '#d1fae5', // emerald-100
        primaryLightest: '#f0fdf4', // emerald-50
        primaryDark: '#047857', // emerald-700
        secondary: '#0ea5e9', // sky-500
        secondaryHover: '#0284c7', // sky-600
        background: '#f8fafc', // slate-50
        surface: '#ffffff', // white
        border: '#e2e8f0', // slate-200
        textPrimary: '#1e293b', // slate-800
        textSecondary: '#64748b', // slate-500
        textOnPrimary: '#ffffff', // white
    },
};

const sunsetTheme: Theme = {
    name: 'Sunset',
    colors: {
        primary: '#f97316', // orange-500
        primaryHover: '#ea580c', // orange-600
        primaryLight: '#ffedd5', // orange-100
        primaryLightest: '#fff7ed', // orange-50
        primaryDark: '#c2410c', // orange-700
        secondary: '#d946ef', // fuchsia-500
        secondaryHover: '#c026d3', // fuchsia-600
        background: '#fffbeb', // yellow-50
        surface: '#ffffff', // white
        border: '#fde68a', // yellow-200
        textPrimary: '#422006', // dark brown
        textSecondary: '#78350f', // brown
        textOnPrimary: '#ffffff', // white
    },
};

const indigoTheme: Theme = {
    name: 'Indigo',
    colors: {
        primary: '#6366f1', // indigo-500
        primaryHover: '#4f46e5', // indigo-600
        primaryLight: '#e0e7ff', // indigo-100
        primaryLightest: '#eef2ff', // indigo-50
        primaryDark: '#4338ca', // indigo-700
        secondary: '#ec4899', // pink-500
        secondaryHover: '#db2777', // pink-600
        background: '#f5f3ff', // violet-50
        surface: '#ffffff', // white
        border: '#ddd6fe', // violet-200
        textPrimary: '#1e1b4b', // midnight
        textSecondary: '#4c1d95', // violet-900
        textOnPrimary: '#ffffff', // white
    },
};


export const THEMES: Theme[] = [defaultTheme, mintTheme, sunsetTheme, indigoTheme];

export const FONTS: Font[] = ['Inter', 'Poppins', 'Roboto Slab'];
