// Register Service Worker for PWA setup
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
}

// Local AI: Rule-based Categorization Engine
const categoryRules = {
    'Food & Drink': ['starbucks', 'mcdonalds', 'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'subway', 'bar', 'grill', 'diner', 'food', 'dinner'],
    'Groceries': ['walmart', 'target', 'whole foods', 'trader joe', 'kroger', 'safeway', 'albert', 'market', 'grocery', 'aldi', 'supermarket'],
    'Transport': ['uber', 'lyft', 'taxi', 'gas', 'shell', 'chevron', 'exxon', 'train', 'flight', 'airline', 'transit', 'metro'],
    'Entertainment': ['netflix', 'spotify', 'movie', 'cinema', 'theater', 'ticket', 'game', 'steam', 'playstation', 'xbox', 'hbo', 'disney'],
    'Shopping': ['amazon', 'apple', 'best buy', 'ikea', 'zara', 'h&m', 'mall', 'clothing', 'shoes', 'electronics'],
    'Bills & Utilities': ['electric', 'water', 'internet', 'comcast', 'verizon', 't-mobile', 'at&t', 'rent', 'mortgage', 'insurance'],
    'Health & Wellness': ['pharmacy', 'cvs', 'walgreens', 'doctor', 'hospital', 'gym', 'planet fitness', 'clinic']
};

function categorizePlace(placeName) {
    if (!placeName) return null;
    const lowerPlace = placeName.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryRules)) {
        if (keywords.some(keyword => lowerPlace.includes(keyword))) {
            return category;
        }
    }
    return 'Miscellaneous';
}

// DOM Elements
const form = document.getElementById('expense-form');
const amountInput = document.getElementById('amount');
const placeInput = document.getElementById('place');
const aiSuggestion = document.getElementById('ai-suggestion');
const suggestedCategorySpan = document.getElementById('suggested-category');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const balanceDisplay = document.getElementById('balance-display');
const toggleBalanceBtn = document.getElementById('toggle-balance-btn');
const eyeHiddenIcon = document.getElementById('eye-hidden-icon');
const eyeVisibleIcon = document.getElementById('eye-visible-icon');

// Overlay Elements
const sidePanel = document.getElementById('side-panel');
const openMenuBtn = document.getElementById('open-menu-btn');
const closePanelBtn = document.getElementById('close-panel-btn');
const viewExpensesBtn = document.getElementById('view-expenses-btn');
const scrollContent = document.querySelector('.scroll-content');

// Income Elements
const incomeForm = document.getElementById('income-form');
const incomeAmountInput = document.getElementById('income-amount');
// Table Element
const transactionsTableBody = document.getElementById('transactions-table-body');

// Initialize Greeting
function initGreeting() {
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;
    
    const hour = new Date().getHours();
    let timeGreeting = "Good Evening";
    
    if (hour < 12) {
        timeGreeting = "Good Morning";
    } else if (hour < 17) {
        timeGreeting = "Good Afternoon";
    }
    
    greetingEl.textContent = `${timeGreeting}, Jithendran`;
}

// Internal State
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
let isBalanceHidden = true; // Required by user: hidden by default

// Format Currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Update Balance
function updateBalance() {
    let balance = 0;
    transactions.forEach(tx => {
        if (tx.type === 'income') balance += tx.amount;
        else balance -= tx.amount;
    });

    if (isBalanceHidden) {
        balanceDisplay.textContent = '••••••';
        balanceDisplay.classList.remove('balance-negative');
        eyeHiddenIcon.classList.remove('hidden');
        eyeVisibleIcon.classList.add('hidden');
    } else {
        balanceDisplay.textContent = formatCurrency(Math.abs(balance));

        if (balance < 0) {
            balanceDisplay.textContent = '-' + balanceDisplay.textContent;
            balanceDisplay.classList.add('balance-negative');
        } else {
            balanceDisplay.classList.remove('balance-negative');
        }
        eyeHiddenIcon.classList.add('hidden');
        eyeVisibleIcon.classList.remove('hidden');
    }
}

// Toggle Balance specific action
if (toggleBalanceBtn) {
    toggleBalanceBtn.addEventListener('click', () => {
        isBalanceHidden = !isBalanceHidden;
        updateBalance();
    });
}

// Render Transactions Table
function renderTransactions() {
    transactionsTableBody.innerHTML = '';

    if (transactions.length === 0) {
        transactionsTableBody.innerHTML = '<tr><td colspan="3" class="empty-state">No transactions yet.</td></tr>';
        return;
    }

    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach(tx => {
        const tr = document.createElement('tr');
        const isExpense = tx.type === 'expense';
        const formattedAmount = (isExpense ? '-' : '+') + formatCurrency(tx.amount);
        const dateStr = new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        const catOrIncome = tx.type === 'income' ? 'Income' : tx.category;

        tr.innerHTML = `
            <td>${dateStr}</td>
            <td>
                <div>${tx.place}</div>
                <span class="tx-cat-sub">${catOrIncome}</span>
            </td>
            <td class="tx-amt-col ${isExpense ? 'expense' : 'income'}">${formattedAmount}</td>
        `;
        transactionsTableBody.appendChild(tr);
    });
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// AI suggestion updates
const handlePlaceInput = debounce((e) => {
    const place = e.target.value.trim();
    if (place.length > 2) {
        const category = categorizePlace(place);
        suggestedCategorySpan.textContent = category;
        aiSuggestion.classList.remove('hidden');
    } else {
        aiSuggestion.classList.add('hidden');
    }
}, 300);

placeInput.addEventListener('input', handlePlaceInput);

// Toggle Side Panel
function openPanel() {
    renderTransactions();
    sidePanel.classList.add('active');
}
function closePanel() {
    sidePanel.classList.remove('active');
}

viewExpensesBtn.addEventListener('click', openPanel);
closePanelBtn.addEventListener('click', closePanel);

sidePanel.addEventListener('click', (e) => {
    if (e.target === sidePanel) closePanel();
});

// Expense Submission
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const place = placeInput.value.trim();

    if (isNaN(amount) || amount <= 0 || !place) return;

    // Temporarily disable button to show loading state
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Locating...</span>';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.pointerEvents = 'none';

    let coordinates = null;

    try {
        // Use OpenStreetMap Nominatim to geocode the inputted place string
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            coordinates = { 
                lat: parseFloat(data[0].lat), 
                lng: parseFloat(data[0].lon) 
            };
        }
    } catch (err) {
        console.log("OSM fetch failed", err);
    }

    saveTransaction('expense', amount, place, categorizePlace(place), coordinates);

    // Restore UI
    amountInput.value = '';
    placeInput.value = '';
    aiSuggestion.classList.add('hidden');
    submitBtn.innerHTML = originalBtnHTML;
    submitBtn.style.opacity = '1';
    submitBtn.style.pointerEvents = 'all';

    showToast('Expense logged successfully.');

    openPanel();
    setTimeout(() => {
        scrollContent.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
});

// Income Submission
incomeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(incomeAmountInput.value);
    
    if (isNaN(amount) || amount <= 0) return;

    saveTransaction('income', amount, 'Income Added', 'Income', null);

    incomeAmountInput.value = '';

    showToast('Income added successfully.');

    // Auto scroll up to let them see the new table entry since table is at top now
    setTimeout(() => {
        scrollContent.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
});

// Save Transaction Engine
function saveTransaction(type, amount, place, category, coords) {
    const record = {
        id: Date.now(),
        type: type,
        amount: amount,
        place: place,
        category: category,
        coordinates: coords,
        date: new Date().toISOString()
    };

    transactions.push(record);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateBalance();

    // Check if panel is active to live render changes
    if (sidePanel.classList.contains('active')) {
        renderTransactions();
    }
}

// Toast System
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 400);
    }, 3000);
}

// Initialization
window.onload = () => {
    initGreeting();
    updateBalance();
    setTimeout(() => amountInput.focus(), 500);
};
