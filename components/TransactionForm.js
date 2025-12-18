import React, { useState, useRef, useEffect } from 'https://aistudiocdn.com/react@^19.2.0';

const LoadingSpinner = () => (
    <div className="border-2 border-[var(--color-primary-light)] border-t-[var(--color-text-on-primary)] rounded-full w-4 h-4 animate-spin"></div>
);

const TransactionForm = ({ categories, studentNames, onAddTransaction, onAddCategory }) => {
    const [nama, setNama] = useState('');
    const [kategori, setKategori] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [keterangan, setKeterangan] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const suggestionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setNama(value);
        if (value.length > 0) {
            const filtered = studentNames.filter(name =>
                name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (name) => {
        setNama(name);
        setSuggestions([]);
    };

    const handleAddCategoryClick = () => {
        onAddCategory(newCategory.trim());
        setNewCategory('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nama || !kategori || !jumlah || !tanggal) {
            alert('Mohon lengkapi semua field yang wajib diisi.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            onAddTransaction({
                nama: nama.trim(),
                kategori,
                jumlah: parseInt(jumlah),
                tanggal,
                keterangan: keterangan.trim(),
            });
            setNama('');
            setKategori('');
            setJumlah('');
            setTanggal(new Date().toISOString().split('T')[0]);
            setKeterangan('');
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <div className="bg-[var(--color-surface)] rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Tambah Transaksi Baru</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                    <label htmlFor="nama" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Nama Siswa</label>
                    <input
                        type="text"
                        id="nama"
                        value={nama}
                        onChange={handleNameChange}
                        required
                        autoComplete="off"
                        className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        placeholder="Ketik nama siswa..."
                    />
                    {suggestions.length > 0 && (
                        <div ref={suggestionsRef} className="absolute z-10 w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                            {suggestions.map((name, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSuggestionClick(name)}
                                    className="px-3 py-2 cursor-pointer hover:bg-[var(--color-primary-lightest)] text-sm"
                                >
                                    {name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="kategori" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Kategori</label>
                    <select
                        id="kategori"
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="jumlah" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Jumlah (Rp)</label>
                    <input
                        type="number"
                        id="jumlah"
                        value={jumlah}
                        onChange={(e) => setJumlah(e.target.value)}
                        required
                        min="0"
                        step="1000"
                        className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="tanggal" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Tanggal</label>
                    <input
                        type="date"
                        id="tanggal"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="keterangan" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Keterangan</label>
                    <input
                        type="text"
                        id="keterangan"
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        placeholder="Opsional"
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-1 flex items-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[var(--color-primary)] text-[var(--color-text-on-primary)] px-4 py-2 rounded-md hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <><LoadingSpinner /> <span className="ml-2">Menyimpan...</span></> : 'Tambah Transaksi'}
                    </button>
                </div>
            </form>
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategoryClick()}
                        placeholder="Kategori baru"
                        className="flex-1 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent"
                    />
                    <button
                        type="button"
                        onClick={handleAddCategoryClick}
                        className="bg-[var(--color-secondary)] text-[var(--color-text-on-primary)] px-4 py-2 rounded-md hover:bg-[var(--color-secondary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] transition-colors"
                    >
                        Tambah Kategori
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionForm;