import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://bytex-backend-9clz.onrender.com/api/transactions';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL);
      // DEFENSIVE LOGIC: Check if data is an array, or if it has a nested transactions key
      let data = response.data;
      if (!Array.isArray(data)) {
        if (data.transactions && Array.isArray(data.transactions)) {
          data = data.transactions;
        } else {
          data = [];
        }
      }
      setTransactions(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setTransactions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    try {
      await axios.post(API_URL, { description, amount: Number(amount), type });
      setDescription('');
      setAmount('');
      fetchTransactions();
    } catch (error) {
      console.error('Post error:', error);
    }
  };

  // DEFENSIVE CALCULATIONS
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const totalIncome = safeTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    
  const totalExpense = safeTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="p-6 text-center bg-white shadow-lg rounded-xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">📊 Bytex Smart Ledger</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-blue-50"><p className="text-sm font-semibold text-blue-600">BALANCE</p><p className="text-2xl font-bold">${balance.toFixed(2)}</p></div>
            <div className="p-4 rounded-lg bg-green-50"><p className="text-sm font-semibold text-green-600">INCOME</p><p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p></div>
            <div className="p-4 rounded-lg bg-red-50"><p className="text-sm font-semibold text-red-600">EXPENSE</p><p className="text-2xl font-bold">${totalExpense.toFixed(2)}</p></div>
          </div>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row">
            <input className="flex-1 p-2 border rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input className="w-full p-2 border rounded md:w-32" type="number" placeholder="Amt" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <select className="p-2 border rounded" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button className="px-6 py-2 text-white bg-blue-600 rounded" type="submit">Add</button>
          </form>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-bold">History</h2>
          {safeTransactions.map((t, i) => (
            <li key={i} className="flex justify-between p-3 border-b">
              <span>{t.description}</span>
              <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {t.type === 'income' ? '+' : '-'}${t.amount?.toFixed(2)}
              </span>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;