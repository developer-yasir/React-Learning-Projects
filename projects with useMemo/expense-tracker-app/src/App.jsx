import React from 'react'
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import './index.css'
import { useState } from 'react';

function App() {
  
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction)=>{
    setTransactions([...transactions, transaction] );
  }

  return (
    <div className='container'>
      <h1>Expense Tracker Dashboard</h1>
      <TransactionForm addTransaction = {addTransaction}/>
      <Summary transactions = {transactions} />
      <TransactionList transactions = {transactions}/>
    </div>
    )
}

export default App;