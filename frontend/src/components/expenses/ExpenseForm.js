import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addExpense } from '../../services/expenseService';
import { validateExpenseData } from '../../utils/expenseHelpers';
import '../../styles/ExpenseForm.css';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [category, setCategory] = useState('');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const predefinedCategories = [
    'Groceries',
    'Transportation',
    'Entertainment',
    'Utilities',
  ];

  const frequencyOptions = ['once', 'weekly', 'biweekly', 'monthly', 'yearly'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const finalCategory =
        category === 'custom' ? customCategoryName : category;
      validateExpenseData({ category: finalCategory, amount });

      const response = await addExpense({
        category: finalCategory,
        amount: parseFloat(amount),
        date: date || new Date().toISOString(),
        description,
        frequency,
      });

      onExpenseAdded(response.data);
      setMessage('Expense added successfully!');
    } catch (error) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
      setCategory('');
      setCustomCategoryName('');
      setAmount('');
      setDate('');
      setDescription('');
      setFrequency('once');
    }
  };

  return (
    <div className="expense-form">
      <h2>Add a New Expense</h2>
      <form onSubmit={handleSubmit}>
        {/* Category Input */}
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a Category</option>
            {predefinedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="custom">Custom Category</option>
          </select>
        </div>

        {/* Custom Category Input (Visible only if "Custom Category" is selected) */}
        {category === 'custom' && (
          <div className="form-group">
            <label htmlFor="customCategoryName">Custom Category Name:</label>
            <input
              type="text"
              id="customCategoryName"
              value={customCategoryName}
              onChange={(e) => setCustomCategoryName(e.target.value)}
              required
              placeholder="Enter custom category name"
            />
          </div>
        )}

        {/* Amount Input */}
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>

        {/* Date Input */}
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description"
          />
        </div>

        {/* Frequency Selection */}
        <div className="form-group">
          <label htmlFor="frequency">Frequency</label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            {frequencyOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

ExpenseForm.propTypes = {
  onExpenseAdded: PropTypes.func.isRequired,
};

export default ExpenseForm;
