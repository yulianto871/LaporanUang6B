
const { useState, useMemo, useEffect, useCallback, createContext, useContext, useRef } = React;

// --- 1. CONSTANTS ---
const INITIAL_CATEGORIES = ["LKS", "Sumbangan", "Tabungan", "TKA"];
const STUDENT_NAMES = [
    "ABYAN ELFAHRI AZANI", "AINA CAHAYA KAMILA", "ANABELLA ZIANITA ALIYANOR AGUSTINE",
    "AVIKA AZZAHRA", "BAYU HUDA KURNIAWAN", "DAVIN PUTRA MAULANA",
    "FARICHI AZKA SATRIYO", "GHANI AUFAR HABIBI", "KEISHA ANINDYA SAKHI",
    "MUHAMMAD ILYAS YUNUS", "MUHAMMAD RIZQI ALMEIRA ABDUL ZUMAR", "NAUFAL AGHAM SYAHPUTRA",
    "NAYLA MUAZARARA ULFA ALFIAN", "NOVA ALYA NURFADILA", "RAFA RASENDRIYA CENDANI",
    "RAFA RAYHANAH TABINA", "RAFI FABIAN LOKHESWARA", "RAFIQ DESTUAJI PRAYOGA",
    "RAKA MAHATMA HIDAYAT", "RIZKA SETIYOWATI", "TIARA AKILA AMARILYS",
    "YUMNA SHAFINA RARA DEWI", "ZAIDAN ARIQ PRADITYA RAFIQ", "ARU ZULHA AL FATIH",
    "RAHMAT RAMADHON", "GENDHIS AYU KINANTHI", "DEVI NUR KURNIAWATI"
];

// --- 2. THEMES ---
const THEMES = [
    {
        name: 'Default',
        colors: { primary: '#3b82f6', background: '#f1f5f9', surface: '#ffffff', textPrimary: '#1e293b' }
    },
    {
        name: 'Mint',
        colors: { primary: '#10b981', background: '#f8fafc', surface: '#ffffff', textPrimary: '#1e293b' }
    },
    {
        name: 'Sunset',
        colors: { primary: '#f97316', background: '#fffbeb', surface: '#ffffff', textPrimary: '#422006' }
    }
];

// --- 3. CONTEXT & PROVIDER ---
const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {
    const [themeName, setThemeName] = useState(localStorage.getItem('app-theme') || THEMES[0].name);
    const theme = THEMES.find(t => t.name === themeName) || THEMES[0];

    useEffect(() => {
        localStorage.setItem('app-theme', themeName);
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-surface', theme.colors.surface);
        root.style.setProperty('--color-text-primary', theme.colors.textPrimary);
    }, [themeName]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme: setThemeName }}>
            {children}
        </ThemeContext.Provider>
    );
};

// --- 4. COMPONENTS ---

const Header = () => (
    <header className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800">LAPORAN KEUANGAN KELAS VI</h1>
        <p className="text-slate-500">TAHUN AJARAN 2025/2026</p>
    </header>
);

const SummaryCard = ({ title, amount, isTotal }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${isTotal ? 'border-blue-500' : 'border-emerald-500'}`}>
        <p className="text-xs font-semibold text-slate-500 uppercase">{title}</p>
        <p className="text-xl font-bold text-slate-800">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)}
        </p>
    </div>
);

const TransactionForm = ({ categories, onAdd }) => {
    const [nama, setNama] = useState('');
    const [kat, setKat] = useState('');
    const [jml, setJml] = useState('');
    const [tgl, setTgl] = useState(new Date().toISOString().split('T')[0]);

    const submit = (e) => {
        e.preventDefault();
        onAdd({ nama, kategori: kat, jumlah: parseInt(jml), tanggal: tgl, id: Date.now() });
        setNama(''); setJml('');
    };

    return (
        <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input list="students" value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama Siswa" className="border p-2 rounded" required />
            <datalist id="students">{STUDENT_NAMES.map(s => <option key={s} value={s} />)}</datalist>
            <select value={kat} onChange={e => setKat(e.target.value)} className="border p-2 rounded" required>
                <option value="">Pilih Kategori</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" value={jml} onChange={e => setJml(e.target.value)} placeholder="Jumlah Rp" className="border p-2 rounded" required />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Tambah</button>
        </form>
    );
};

// --- 5. MAIN APP ---
const App = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories] = useState(INITIAL_CATEGORIES);

    const summary = useMemo(() => {
        const totals = {};
        let grand = 0;
        transactions.forEach(t => {
            totals[t.kategori] = (totals[t.kategori] || 0) + t.jumlah;
            grand += t.jumlah;
        });
        return { totals, grand };
    }, [transactions]);

    const handleExportPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Laporan Keuangan Kelas VI", 14, 15);
        doc.autoTable({
            startY: 25,
            head: [['No', 'Nama', 'Kategori', 'Jumlah', 'Tanggal']],
            body: transactions.map((t, i) => [i + 1, t.nama, t.kategori, t.jumlah, t.tanggal]),
        });
        doc.save("Laporan_Keuangan.pdf");
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <Header />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <SummaryCard title="Total Kas" amount={summary.grand} isTotal />
                {Object.entries(summary.totals).map(([k, v]) => (
                    <SummaryCard key={k} title={k} amount={v} />
                ))}
            </div>
            
            <TransactionForm categories={categories} onAdd={t => setTransactions([t, ...transactions])} />

            <div className="flex justify-end mb-4">
                <button onClick={handleExportPDF} className="bg-emerald-600 text-white px-4 py-2 rounded shadow hover:bg-emerald-700">Ekspor PDF</button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4">Nama</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Jumlah</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id} className="border-b hover:bg-slate-50">
                                <td className="p-4 font-medium">{t.nama}</td>
                                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{t.kategori}</span></td>
                                <td className="p-4 font-bold">Rp {t.jumlah.toLocaleString()}</td>
                                <td className="p-4 text-slate-500">{t.tanggal}</td>
                                <td className="p-4">
                                    <button onClick={() => setTransactions(transactions.filter(tr => tr.id !== t.id))} className="text-red-500 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- 6. RENDER ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);
