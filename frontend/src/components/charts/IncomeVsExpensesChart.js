import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import PropTypes from 'prop-types';

const IncomeVsExpensesChart = ({ totalIncome, totalExpenses }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Reference to store the Chart instance

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy existing chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new Chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Total Income', 'Total Expenses'],
        datasets: [
          {
            label: 'Income vs Expenses',
            data: [totalIncome, totalExpenses],
            backgroundColor: ['#36a2eb', '#ff6384'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });

    // Cleanup function to destroy chart instance on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [totalIncome, totalExpenses]);

  return (
    <div className="chart">
      <canvas ref={chartRef} width="400" height="400"></canvas>
    </div>
  );
};

// Prop-types validation for the component props
IncomeVsExpensesChart.propTypes = {
  totalIncome: PropTypes.number.isRequired,
  totalExpenses: PropTypes.number.isRequired,
};

export default IncomeVsExpensesChart;
