// Main data storage
let userTransactions = [];

document.addEventListener('DOMContentLoaded', function() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }
    
    // Load user transactions
    loadUserTransactions();
    
    // Initialize chart
    initializeCashflowChart();
    
    // Set up event listeners
    setupChartControls();
    
    // Update UI with current stats
    updateFinancialStats();
});

// Load transactions from localStorage
function loadUserTransactions() {
    const saved = localStorage.getItem('cashflowTransactions');
    
    if (saved) {
        userTransactions = JSON.parse(saved);
        console.log(`Loaded ${userTransactions.length} transactions`);
    } else {
        // Initialize with sample data if empty
        userTransactions = getInitialTransactions();
        saveTransactions();
    }
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('cashflowTransactions', JSON.stringify(userTransactions));
}

// Initialize the cashflow chart
function initializeCashflowChart() {
    const canvas = document.getElementById('cashflowChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (window.cashflowChart) {
        window.cashflowChart.destroy();
    }
    
    // Get selected year
    const selectedYear = document.getElementById('yearSelector')?.value || new Date().getFullYear();
    
    // Process data for selected year
    const { monthlyNet, monthlyIncome, monthlyExpenses } = processYearlyData(selectedYear);
    
    // Create the chart
    window.cashflowChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Net Cash Flow',
                    data: monthlyNet,
                    backgroundColor: monthlyNet.map(value => 
                        value >= 0 ? 'rgba(76, 175, 80, 0.7)' : 'rgba(255, 99, 132, 0.7)'
                    ),
                    borderColor: monthlyNet.map(value => 
                        value >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(255, 99, 132, 1)'
                    ),
                    borderWidth: 1,
                    borderRadius: 5,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Inter, sans-serif',
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            
                            const value = context.raw;
                            const monthIndex = context.dataIndex;
                            const income = monthlyIncome[monthIndex];
                            const expense = monthlyExpenses[monthIndex];
                            
                            if (context.datasetIndex === 0) {
                                label += `CFA ${Math.abs(value).toLocaleString()} `;
                                label += value >= 0 ? '(Surplus)' : '(Deficit)';
                                
                                // Show breakdown in tooltip
                                return [
                                    label,
                                    `Income: CFA ${income.toLocaleString()}`,
                                    `Expenses: CFA ${expense.toLocaleString()}`
                                ];
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter, sans-serif',
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter, sans-serif',
                        },
                        callback: function(value) {
                            return 'CFA ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Process data for a specific year
function processYearlyData(year) {
    const monthlyIncome = new Array(12).fill(0);
    const monthlyExpenses = new Array(12).fill(0);
    const monthlyNet = new Array(12).fill(0);
    
    // Filter transactions for the selected year
    const yearTransactions = userTransactions.filter(transaction => {
        const transactionYear = new Date(transaction.date).getFullYear();
        return transactionYear.toString() === year.toString();
    });
    
    // Aggregate data by month
    yearTransactions.forEach(transaction => {
        const month = new Date(transaction.date).getMonth(); // 0-11
        
        if (transaction.type === 'income') {
            monthlyIncome[month] += transaction.amount;
            monthlyNet[month] += transaction.amount;
        } else if (transaction.type === 'expense') {
            monthlyExpenses[month] += transaction.amount;
            monthlyNet[month] -= transaction.amount;
        }
    });
    
    return { monthlyIncome, monthlyExpenses, monthlyNet };
}

// Setup chart controls
function setupChartControls() {
    const yearSelector = document.getElementById('yearSelector');
    if (yearSelector) {
        yearSelector.addEventListener('change', function() {
            updateChart();
            updateFinancialStats();
        });
    }
    
    // Time filter buttons
    document.querySelectorAll('.time-filter').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.time-filter').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // You could implement different views here (monthly vs yearly)
        });
    });
}

// Update chart with current data
function updateChart() {
    if (window.cashflowChart) {
        window.cashflowChart.destroy();
    }
    initializeCashflowChart();
}

// Update financial statistics
function updateFinancialStats() {
    const selectedYear = document.getElementById('yearSelector')?.value || new Date().getFullYear();
    const { monthlyIncome, monthlyExpenses } = processYearlyData(selectedYear);
    
    // Calculate totals
    const totalIncome = monthlyIncome.reduce((sum, val) => sum + val, 0);
    const totalExpenses = monthlyExpenses.reduce((sum, val) => sum + val, 0);
    const netBalance = totalIncome - totalExpenses;
    
    // Update UI
    document.getElementById('totalIncome').textContent = totalIncome.toLocaleString();
    document.getElementById('totalExpenses').textContent = totalExpenses.toLocaleString();
    
    const netBalanceElement = document.getElementById('netBalance');
    netBalanceElement.textContent = `CFA ${Math.abs(netBalance).toLocaleString()}`;
    netBalanceElement.className = netBalance >= 0 ? 'stat-value positive' : 'stat-value negative';
    
    // Add indicator
    netBalanceElement.innerHTML += netBalance >= 0 ? 
        ' <span style="color:#4CAF50">▲</span>' : 
        ' <span style="color:#FF6384">▼</span>';
}

// Function to add a new transaction (connect this to your "Add Transaction" button)
function addTransaction(transactionData) {
    const newTransaction = {
        id: Date.now(),
        ...transactionData,
        date: transactionData.date || new Date().toISOString().split('T')[0],
        time: transactionData.time || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    userTransactions.push(newTransaction);
    saveTransactions();
    
    // Update everything
    updateChart();
    updateFinancialStats();
    updateTransactionListUI(); // You'll need to implement this
    
    console.log('Transaction added:', newTransaction);
    return newTransaction;
}

// Function to delete a transaction
function deleteTransaction(transactionId) {
    userTransactions = userTransactions.filter(t => t.id !== transactionId);
    saveTransactions();
    
    updateChart();
    updateFinancialStats();
    updateTransactionListUI();
}

// Sample initial transactions
function getInitialTransactions() {
    return [
        {
            id: 1,
            type: "income",
            category: "Salary",
            description: "Monthly Salary",
            amount: 1000000,
            currency: "CFA",
            date: "2024-07-28"
        },
        {
            id: 2,
            type: "expense",
            category: "Food",
            description: "Lunch at Restaurant",
            amount: 5000,
            currency: "CFA",
            date: "2024-07-31"
        },
        {
            id: 3,
            type: "expense",
            category: "Entertainment",
            description: "Movie Tickets",
            amount: 10000,
            currency: "CFA",
            date: "2024-07-30"
        },
        {
            id: 4,
            type: "expense",
            category: "Shopping",
            description: "New Shoes",
            amount: 25000,
            currency: "CFA",
            date: "2024-07-25"
        },
        {
            id: 5,
            type: "income",
            category: "Freelance",
            description: "Web Design Project",
            amount: 150000,
            currency: "CFA",
            date: "2024-07-20"
        }
    ];
}

// Helper function to format currency
function formatCurrency(amount) {
    return `CFA ${amount.toLocaleString()}`;
}

// Function to simulate adding a transaction (for testing)
function simulateAddTransaction() {
    const types = ['income', 'expense'];
    const categories = {
        income: ['Salary', 'Freelance', 'Investment', 'Bonus'],
        expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills']
    };
    
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[type][Math.floor(Math.random() * categories[type].length)];
    
    const transaction = {
        type: type,
        category: category,
        description: `${type === 'income' ? 'Received' : 'Spent on'} ${category.toLowerCase()}`,
        amount: type === 'income' ? 
            Math.floor(Math.random() * 500000) + 100000 : 
            Math.floor(Math.random() * 50000) + 1000,
        currency: "CFA"
    };
    
    addTransaction(transaction);
}