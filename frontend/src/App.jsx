import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
    const [data, setData] = useState({ transactions: [], summary: { income: 0, expense: 0, balance: 0 } });
    const [formData, setFormData] = useState({ type: 'expense', amount: '', category: '', description: '' });

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/transactions');
            if (!res.ok) throw new Error("Network response was not ok");
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Failed to load ledger data", error);
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setFormData({ type: 'expense', amount: '', category: '', description: '' });
            fetchData(); 
        } catch (error) {
            console.error("Failed to save transaction", error);
        }
    };

    // Animation variants for smooth loading
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen p-6 font-sans bg-slate-950 text-slate-200 md:p-12 selection:bg-indigo-500 selection:text-white">
            <div className="max-w-5xl mx-auto">
                
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-10"
                >
                    <div className="p-3 border bg-indigo-500/10 rounded-xl border-indigo-500/20">
                        <Activity className="text-indigo-400" size={28} />
                    </div>
                    <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white to-slate-400 bg-clip-text">
                        Smart Ledger
                    </h1>
                </motion.header>
                
                {/* Summary Cards */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-3"
                >
                    <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-[0_0_15px_rgba(34,197,94,0.05)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400"></div>
                        <p className="mb-1 text-sm font-medium text-slate-400">Total Income</p>
                        <h2 className="text-3xl font-bold text-emerald-400">${data.summary.income.toFixed(2)}</h2>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-[0_0_15px_rgba(239,68,68,0.05)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-400"></div>
                        <p className="mb-1 text-sm font-medium text-slate-400">Total Expenses</p>
                        <h2 className="text-3xl font-bold text-rose-400">${data.summary.expense.toFixed(2)}</h2>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-[0_0_15px_rgba(99,102,241,0.05)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-400"></div>
                        <p className="mb-1 text-sm font-medium text-slate-400">Net Balance</p>
                        <h2 className="text-3xl font-bold text-indigo-400">${data.summary.balance.toFixed(2)}</h2>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Add Transaction Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 border lg:col-span-1 bg-slate-900/40 rounded-2xl border-slate-800 h-fit"
                    >
                        <h3 className="flex items-center gap-2 mb-5 text-lg font-semibold text-white">
                            <Plus size={18} className="text-indigo-400"/> New Entry
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 ml-1 text-xs font-medium text-slate-400">Transaction Type</label>
                                <select 
                                    className="w-full p-3 transition-all border appearance-none bg-slate-950 border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block mb-1 ml-1 text-xs font-medium text-slate-400">Amount ($)</label>
                                <input 
                                    type="number" placeholder="0.00" 
                                    className="w-full p-3 transition-all border bg-slate-950 border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600" required
                                    value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 ml-1 text-xs font-medium text-slate-400">Category</label>
                                <input 
                                    type="text" placeholder="e.g. Groceries, Salary" 
                                    className="w-full p-3 transition-all border bg-slate-950 border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600" required
                                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 ml-1 text-xs font-medium text-slate-400">Description (Optional)</label>
                                <input 
                                    type="text" placeholder="Additional details..." 
                                    className="w-full p-3 transition-all border bg-slate-950 border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600"
                                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium p-3 rounded-xl transition-colors mt-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                Save Transaction
                            </button>
                        </form>
                    </motion.div>

                    {/* Transaction List */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 border lg:col-span-2 bg-slate-900/40 rounded-2xl border-slate-800"
                    >
                        <h3 className="mb-5 text-lg font-semibold text-white">Recent Activity</h3>
                        {data.transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                <Activity size={48} className="mb-4 opacity-20" />
                                <p>No transactions yet. Add your first one!</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {data.transactions.map((t, index) => (
                                    <motion.li 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={t.id} 
                                        className="flex items-center justify-between p-4 transition-colors border bg-slate-950/50 rounded-xl border-slate-800/50 hover:border-slate-700"
                                    >
                                        <div>
                                            <p className="flex items-center gap-2 font-medium text-slate-200">
                                                {t.category} 
                                                {t.is_anomaly && (
                                                    <span className="flex items-center gap-1 text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/20">
                                                        <AlertTriangle size={12} /> High Alert
                                                    </span>
                                                )}
                                            </p>
                                            {t.description && <p className="text-sm text-slate-500 mt-0.5">{t.description}</p>}
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-semibold text-lg ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}