// src/components/TransactionList.js
import React from 'react';

function TransactionList({ transactions }) {
  return (
    <div className="transaction-list">
      <h2> All Transactions</h2>
      {transactions.map((tx) => (
        <div key={tx.id} className={`transaction ${tx.type}`}>
          <span>{tx.title}</span>
          <span>{tx.type === 'expense' ? '-' : '+'} Rs {tx.amount}</span>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;
