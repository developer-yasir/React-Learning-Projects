// src/components/Summary.js
import React, { useMemo } from 'react';

function Summary({ transactions }) {
  const { income, expense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  return (
    <div className="summary">
      <h2> Summary</h2>
      <p>Income: Rs {income}</p>
      <p>Expenses: Rs {expense}</p>
      <h3>Balance: Rs {balance}</h3>
    </div>
  );
}

export default Summary;
