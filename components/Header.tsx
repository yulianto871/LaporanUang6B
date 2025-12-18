import React from 'https://aistudiocdn.com/react@^19.2.0';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-[var(--color-surface)] rounded-lg shadow-md p-6 mb-6">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] text-center mb-2">{title}</h1>
      <p className="text-lg text-[var(--color-text-secondary)] text-center">{subtitle}</p>
    </header>
  );
};

export default Header;