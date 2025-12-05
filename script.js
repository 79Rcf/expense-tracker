const categoryIcons = {

    'Entertainment': `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m160-800 80 160h120l-80-160h80l80 160h120l-80-160h80l80 160h120l-80-160h120q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800Zm0 240v320h640v-320H160Zm0 0v320-320Z"/></svg>`,
    

    'Restaurant': `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-240h40v-160q25 0 42.5-17.5T500-460v-120h-40v120h-20v-120h-40v120h-20v-120h-40v120q0 25 17.5 42.5T400-400v160Zm160 0h40v-340q-33 0-56.5 23.5T520-500v120h40v140ZM160-120v-480l320-240 320 240v480H160Zm80-80h480v-360L480-740 240-560v360Zm240-270Z"/></svg>`,
    

    'Transfer': `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z"/></svg>`,
    

    'Salary': `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`,
    
    'default': `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-80q-33 0-56.5-23.5T80-160v-400q0-33 23.5-56.5T160-640h640q33 0 56.5 23.5T880-560v400q0 33-23.5 56.5T800-80H160Zm0-80h640v-400H160v400Zm240-40 240-160-240-160v320ZM160-680v-80h640v80H160Zm120-120v-80h400v80H280ZM160-160v-400 400Z"/></svg>`
};


const categoryIconMap = {
    'Entertainment': 'Entertainment',
    'Restaurant': 'Restaurant',
    'Transfer': 'Transfer',
    'Salary': 'Salary',
    'Food': 'Restaurant',
    'Transport': 'Transfer',
    'Shopping': 'Entertainment',
    'Bills': 'default',
    'Healthcare': 'default',
    'Education': 'default',
    'Investment': 'Transfer',
    'Freelance': 'Salary',
    'Gift': 'default',
    'Business': 'default',
    'Other': 'default'
};

class DynamicTransactionManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.init();
    }
    
    init() {
        this.renderAllTransactions();
        this.setupEventListeners();
    }
    
    showAddForm() {
        const formHTML = `
            <div class="form-header">
                <h3>Add New Transaction</h3>
                <button class="close-btn" onclick="transactionManager.hideForm()">×</button>
            </div>
            
            <form id="transactionForm" onsubmit="return transactionManager.handleFormSubmit(event)">
                <div class="form-group">
                    <label class="form-label">Transaction Type</label>
                    <div class="type-toggle">
                        <button type="button" class="type-btn income-btn active" onclick="transactionManager.setType('income')">💰 Income</button>
                        <button type="button" class="type-btn expense-btn" onclick="transactionManager.setType('expense')">💸 Expense</button>
                    </div>
                    <input type="hidden" id="transactionType" value="income">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" class="form-input" id="description" placeholder="e.g., Lunch at restaurant" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Amount (CFA)</label>
                    <input type="number" class="form-input" id="amount" placeholder="0" min="0" step="100" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" id="category" onchange="transactionManager.updateCategoryIcon()">
                        <option value="Food">Food</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Transport">Transport</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-input" id="date" value="${this.getTodayDate()}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Time</label>
                    <input type="time" class="form-input" id="time" value="${this.getCurrentTime()}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes (Optional)</label>
                    <textarea class="form-input" id="notes" rows="2" placeholder="Additional details..."></textarea>
                </div>
                
                <div class="form-buttons">
                    <button type="button" class="cancel-btn" onclick="transactionManager.hideForm()">Cancel</button>
                    <button type="submit" class="submit-btn">Add Transaction</button>
                </div>
            </form>
            
            <div class="form-preview">
                <h4>Preview:</h4>
                <div id="livePreview"></div>
            </div>
        `;
        
        document.querySelector('.form-container').innerHTML = formHTML;
        document.getElementById('formOverlay').style.display = 'flex';
        
  
        this.setupLivePreview();
    }
    

    handleFormSubmit(event) {
        event.preventDefault();
        
        const transactionData = {
            id: Date.now(),
            type: document.getElementById('transactionType').value,
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            notes: document.getElementById('notes').value,
            createdAt: new Date().toISOString()
        };
        
        this.addTransaction(transactionData);
        this.hideForm();
        return false;
    }
    

    addTransaction(data) {
        this.transactions.unshift(data);
        this.saveTransactions();
        this.createTransactionCard(data);
        this.updateChartAndStats();
        this.showNotification('Transaction added!', 'success');
    }

    createTransactionCard(transaction) {
        const template = document.getElementById('transactionCardTemplate');
        const card = template.content.cloneNode(true);
        const cardElement = card.querySelector('.category-card');
        

        cardElement.dataset.transactionId = transaction.id;

        const dateElement = cardElement.querySelector('.category-date');
        const formattedDate = this.formatDate(transaction.date);
        dateElement.textContent = formattedDate;
        

        const iconElement = cardElement.querySelector('.category-icon');
        const iconKey = categoryIconMap[transaction.category] || 'default';
        iconElement.innerHTML = categoryIcons[iconKey];
        
     
        cardElement.querySelector('.transaction-description').textContent = transaction.description;
        
 
        const categoryBtn = cardElement.querySelector('.category-button');
        categoryBtn.textContent = transaction.category;
        
        
        const amountElement = cardElement.querySelector('.category-amount-value');
        const prefix = transaction.type === 'income' ? '+' : '-';
        amountElement.textContent = `${prefix}CFA ${transaction.amount.toLocaleString()}`;
        amountElement.className = transaction.type === 'income' ? 
            'category-amount-value income' : 'category-amount-value expense';
        
      
        const menuBtn = cardElement.querySelector('.transaction-menu-btn');
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            this.showTransactionMenu(transaction.id, e.target.closest('button'));
        };
        
       
        cardElement.onclick = (e) => {
            if (!e.target.closest('.transaction-menu-btn')) {
                this.showTransactionDetails(transaction.id);
            }
        };
        
    
        const container = document.getElementById('dynamicTransactionsContainer');
        container.prepend(cardElement);
    }
    

    renderAllTransactions() {
        const container = document.getElementById('dynamicTransactionsContainer');
        container.innerHTML = '';
        
        if (this.transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                        <h3>No transactions yet</h3>
                        <p>Your transactions will appear here</p>
                        <button class="summary-button" onclick="transactionManager.showAddForm()">
                            + Add Your First Transaction
                        </button>
                    </div>
                </div>
            `;
            return;
        }
        

        const grouped = this.groupTransactionsByDate(this.transactions);
        
        for (const [date, transactions] of Object.entries(grouped)) {
          
            if (transactions.length > 0) {
                const dateHeader = document.createElement('p');
                dateHeader.className = 'category-date-header';
                dateHeader.textContent = this.formatDate(date);
                container.appendChild(dateHeader);
            }
            

            transactions.forEach(transaction => {
                this.createTransactionCard(transaction);
            });
        }
    }
    

    showTransactionMenu(transactionId, button) {
        const menu = document.createElement('div');
        menu.className = 'transaction-menu';
        menu.innerHTML = `
            <button onclick="transactionManager.editTransaction(${transactionId})">✏️ Edit</button>
            <button onclick="transactionManager.deleteTransaction(${transactionId})">🗑️ Delete</button>
        `;
        
      
        const rect = button.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.left = `${rect.left}px`;
        menu.style.zIndex = '1000';
        

        document.body.appendChild(menu);
   
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target !== button) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    }
    

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
          
            const card = document.querySelector(`[data-transaction-id="${id}"]`);
            if (card) card.remove();
            
        
            this.showEditForm(transaction);
        }
    }
    

    showEditForm(transaction) {
        const formHTML = `
            <div class="form-header">
                <h3>Edit Transaction</h3>
                <button class="close-btn" onclick="transactionManager.hideForm()">×</button>
            </div>
            
            <form id="editTransactionForm" onsubmit="return transactionManager.handleEditSubmit(event, ${transaction.id})">
                <div class="form-group">
                    <label class="form-label">Transaction Type</label>
                    <div class="type-toggle">
                        <button type="button" class="type-btn income-btn ${transaction.type === 'income' ? 'active' : ''}" 
                                onclick="transactionManager.setType('income')">💰 Income</button>
                        <button type="button" class="type-btn expense-btn ${transaction.type === 'expense' ? 'active' : ''}" 
                                onclick="transactionManager.setType('expense')">💸 Expense</button>
                    </div>
                    <input type="hidden" id="transactionType" value="${transaction.type}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" class="form-input" id="description" value="${transaction.description}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Amount (CFA)</label>
                    <input type="number" class="form-input" id="amount" value="${transaction.amount}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" id="category">
                        ${this.getCategoryOptions(transaction.category)}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-input" id="date" value="${transaction.date}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Time</label>
                    <input type="time" class="form-input" id="time" value="${transaction.time}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-input" id="notes" rows="2">${transaction.notes || ''}</textarea>
                </div>
                
                <div class="form-buttons">
                    <button type="button" class="cancel-btn" onclick="transactionManager.hideForm()">Cancel</button>
                    <button type="submit" class="submit-btn">Update Transaction</button>
                </div>
            </form>
        `;
        
        document.querySelector('.form-container').innerHTML = formHTML;
        document.getElementById('formOverlay').style.display = 'flex';
    }
    
    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            
   
            const card = document.querySelector(`[data-transaction-id="${id}"]`);
            if (card) card.remove();
            
            this.updateChartAndStats();
            this.showNotification('Transaction deleted!', 'warning');
            
            if (this.transactions.length === 0) {
                this.renderAllTransactions();
            }
        }
    }
    

    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }
    
    getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    groupTransactionsByDate(transactions) {
        return transactions.reduce((groups, transaction) => {
            if (!groups[transaction.date]) {
                groups[transaction.date] = [];
            }
            groups[transaction.date].push(transaction);
            return groups;
        }, {});
    }
    
    getCategoryOptions(selected) {
        const categories = ['Food', 'Entertainment', 'Transport', 'Shopping', 'Bills', 
                          'Salary', 'Freelance', 'Transfer', 'Other'];
        return categories.map(cat => 
            `<option value="${cat}" ${cat === selected ? 'selected' : ''}>${cat}</option>`
        ).join('');
    }
    
    setType(type) {
        document.getElementById('transactionType').value = type;
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.${type}-btn`).classList.add('active');
        this.updateLivePreview();
    }
    
    setupLivePreview() {
        const inputs = ['description', 'amount', 'category', 'date'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateLivePreview());
            }
        });
    }
    
    updateLivePreview() {
        const preview = document.getElementById('livePreview');
        if (!preview) return;
        
        const type = document.getElementById('transactionType')?.value || 'income';
        const description = document.getElementById('description')?.value || 'Sample transaction';
        const amount = document.getElementById('amount')?.value || '0';
        const category = document.getElementById('category')?.value || 'Other';
        const date = document.getElementById('date')?.value || this.getTodayDate();
        
        const iconKey = categoryIconMap[category] || 'default';
        const icon = categoryIcons[iconKey];
        
        preview.innerHTML = `
            <div class="category-card preview">
                <p class="category-date">${this.formatDate(date)}</p>
                <div class="category-items">
                    <span class="category-icon">${icon}</span>
                    <div class="category-info">
                        <span>${description}</span>
                        <br>
                        <button class="category-button">${category}</button>
                    </div>
                    <div class="category-amount-container">
                        <p class="category-amount-value ${type}">${type === 'income' ? '+' : '-'}CFA ${parseInt(amount).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    hideForm() {
        document.getElementById('formOverlay').style.display = 'none';
    }
    
    saveTransactions() {
        localStorage.setItem('expenseTransactions', JSON.stringify(this.transactions));
    }
    
    loadTransactions() {
        const saved = localStorage.getItem('expenseTransactions');
        return saved ? JSON.parse(saved) : [];
    }
    
    updateChartAndStats() {
   
        if (typeof updateChartData === 'function') updateChartData();
        if (typeof updateFinancialStats === 'function') updateFinancialStats();
    }
    
    showNotification(message, type) {
      
        console.log(`${type}: ${message}`);
    }
    
    setupEventListeners() {
       
        const addBtn = document.querySelector('.summary-button');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddForm());
        }
    }
}


let transactionManager;

document.addEventListener('DOMContentLoaded', function() {
    transactionManager = new DynamicTransactionManager();
});



















































/* const categoryButton = document.querySelector('.category-button');
const popupForm = document.querySelector('#popupForm');
console.log(popupForm);


categoryButton.addEventListener('click', (()=> {
    showForm();
}));

function showForm(){
    if (popupForm) {
        popupForm.style.display = 'block';
    }
}

function closeForm(){
    if (popupForm) {
        popupForm.style.display = 'none';
    }
} */