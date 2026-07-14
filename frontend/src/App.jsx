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
    } catch (error) { setTransactions([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { description, amount: Number(amount), type });
      setDescription('');
      setAmount('');
      fetchTransactions();
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="max-w-2xl p-10 mx-auto">
      <h1 className="mb-5 text-2xl font-bold">Bytex Smart Ledger</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
        <input className="p-2 border" placeholder="Desc" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input className="p-2 border" type="number" placeholder="Amt" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <select onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button className="p-2 text-white bg-blue-600" type="submit">Add</button>
      </form>
      <ul>
        {transactions.map((t, i) => <li key={i}>{t.description}: ${t.amount}</li>)}
      </ul>
    </div>
  );
}

export default App;