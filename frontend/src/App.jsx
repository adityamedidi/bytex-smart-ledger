import { useState, useEffect } from 'react';
import axios from 'axios';

// Your live Render Backend URL
const API_URL = 'https://bytex-backend-9clz.onrender.com/api/transactions';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  // Fetch transactions when the app loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL);
      // Added safety check: ensure the response is an array before setting state
      if (Array.isArray(response.data)) {
        setTransactions(response.data);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction = {
      description,
      amount: Number(amount),
      type
    };

    try {
      await axios.post(API_URL, newTransaction);
      setDescription('');
      setAmount('');
      fetchTransactions(); 
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  // Calculate totals safely
  const totalIncome = Array.isArray(transactions) 
    ? transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) 
    : 0;
    
  const totalExpense = Array.isArray(transactions) 
    ? transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) 
    : 0;
    
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header & Dashboard */}
        <div className="p-6 text-center bg-white shadow-lg rounded-xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">📊 Bytex Smart Ledger</h1>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
              <p className="text-sm font-semibold text-blue-600 uppercase">Total Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-900' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
            <div className="p-4 border border-green-100 rounded-lg bg-green-50">
              <p className="text-sm font-semibold text-green-600 uppercase">Income</p>
              <p className="text-2xl font-bold text-green-900">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-4 border border-red-100 rounded-lg bg-red-50">
              <p className="text-sm font-semibold text-red-600 uppercase">Expenses</p>
              <p className="text-2xl font-bold text-red-900">${totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Add New Transaction</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm md:w-32 focus:ring-blue-500 focus:border-blue-500"
              required
              min="0.01"
              step="0.01"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm md:w-32 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 font-bold text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="py-4 text-center text-gray-500">No transactions logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {transactions.map((t, index) => (
                <li 
                  key={index} 
                  className={`flex justify-between items-center p-4 rounded-md border-l-4 ${
                    t.type === 'income' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <span className="font-semibold text-gray-800">{t.description}</span>
                  <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;