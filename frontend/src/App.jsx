import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://bytex-backend-9clz.onrender.com/api/transactions';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL);
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, { description, amount: Number(amount), type });
    setDescription(''); setAmount(''); fetchTransactions();
  };

  const totals = transactions.reduce((acc, curr) => {
    curr.type === 'income' ? acc.income += curr.amount : acc.expense += curr.amount;
    return acc;
  }, { income: 0, expense: 0 });

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Bytex Ledger</h1>
            <p className="font-medium text-slate-500">Enterprise-grade financial tracking</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 border bg-slate-800 border-slate-700 rounded-2xl">
             <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
             <span className="text-xs font-bold tracking-widest uppercase">System Operational</span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          
          {/* Card: Balance */}
          <div className="p-8 border shadow-2xl md:col-span-4 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl border-slate-700">
            <p className="mb-2 font-bold text-indigo-300">Net Balance</p>
            <h2 className="text-5xl font-black text-white">${(totals.income - totals.expense).toLocaleString()}</h2>
          </div>

          {/* Card: Income/Expense */}
          <div className="grid grid-cols-2 gap-6 md:col-span-8">
            <div className="p-8 border bg-slate-800 rounded-3xl border-slate-700">
                <p className="mb-1 font-bold text-emerald-400">Total Income</p>
                <p className="text-3xl font-black">${totals.income.toLocaleString()}</p>
            </div>
            <div className="p-8 border bg-slate-800 rounded-3xl border-slate-700">
                <p className="mb-1 font-bold text-rose-400">Total Expenses</p>
                <p className="text-3xl font-black">${totals.expense.toLocaleString()}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-4 border md:col-span-5 bg-slate-900 rounded-3xl border-slate-700">
            <h3 className="mb-4 text-xl font-bold">Add Entry</h3>
            <input className="w-full p-4 border outline-none bg-slate-800 rounded-xl border-slate-700 focus:ring-2 focus:ring-indigo-500" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <div className="flex gap-4">
                <input className="flex-1 p-4 border outline-none bg-slate-800 rounded-xl border-slate-700 focus:ring-2 focus:ring-indigo-500" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <select className="px-4 border bg-slate-800 rounded-xl border-slate-700" onChange={(e) => setType(e.target.value)}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02]">Process Transaction</button>
          </form>

          {/* History */}
          <div className="p-8 border md:col-span-7 bg-slate-900 rounded-3xl border-slate-700">
            <h3 className="mb-6 text-xl font-bold">Recent Activity</h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 transition bg-slate-800 rounded-2xl hover:bg-slate-700">
                  <span className="font-semibold text-white">{t.description}</span>
                  <span className={`font-mono font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;