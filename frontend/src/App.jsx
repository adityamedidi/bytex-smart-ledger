import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        description, 
        amount: parseFloat(amount), 
        type 
      };
      
      const response = await axios.post(API_URL, payload);
      console.log("Submission success:", response.data);
      
      // Clear form and refresh data
      setDescription(''); 
      setAmount(''); 
      fetchTransactions();
    } catch (err) {
      // Detailed error reporting to help us fix the issue
      console.error("Submission failed:", err.response ? err.response.data : err.message);
      alert("Submission failed. Check console for details.");
    }
  };

  const totals = transactions.reduce((acc, curr) => {
    const val = parseFloat(curr.amount) || 0;
    curr.type === 'income' ? acc.income += val : acc.expense += val;
    return acc;
  }, { income: 0, expense: 0 });

  const chartData = transactions.map(t => ({
    ...t,
    amount: parseFloat(t.amount) || 0
  }));

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="p-8 border shadow-2xl md:col-span-4 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl border-slate-700">
            <p className="mb-2 font-bold text-indigo-300">Net Balance</p>
            <h2 className="text-5xl font-black text-white">${(totals.income - totals.expense).toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          </div>

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

          <div className="p-8 border md:col-span-12 bg-slate-900 rounded-3xl border-slate-700">
            <h3 className="mb-6 text-xl font-bold">Financial Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="description" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === 'income' ? '#34d399' : '#fb7185'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4 border md:col-span-5 bg-slate-900 rounded-3xl border-slate-700">
            <h3 className="mb-4 text-xl font-bold">Add Entry</h3>
            <input className="w-full p-4 border outline-none bg-slate-800 rounded-xl border-slate-700 focus:ring-2 focus:ring-indigo-500" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <div className="flex gap-4">
                <input className="flex-1 p-4 border outline-none bg-slate-800 rounded-xl border-slate-700 focus:ring-2 focus:ring-indigo-500" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <select className="px-4 border bg-slate-800 rounded-xl border-slate-700" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02]">Process Transaction</button>
          </form>

          <div className="p-8 border md:col-span-7 bg-slate-900 rounded-3xl border-slate-700">
            <h3 className="mb-6 text-xl font-bold">Recent Activity</h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 transition bg-slate-800 rounded-2xl hover:bg-slate-700">
                  <span className="font-semibold text-white">{t.description}</span>
                  <span className={`font-mono font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
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