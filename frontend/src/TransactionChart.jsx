import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TransactionChart = ({ transactions }) => {
  // Format data for the chart
  const data = transactions.map(t => ({
    name: t.description,
    amount: parseFloat(t.amount),
    type: t.type
  }));

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px', background: '#fff', padding: '10px', borderRadius: '8px' }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.type === 'income' ? '#4ade80' : '#f87171'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;