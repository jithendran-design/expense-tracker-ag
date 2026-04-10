// Register Service Worker for PWA setup
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
}

//Rule-based Categorization Engine
const categoryRules = {
    'Food & Drink': [
        // Indian QSR & Chains
        'zomato', 'swiggy', 'dominos', 'pizza hut', 'kfc', 'mcdonalds', 'burger king',
        'subway', 'dunkin', 'starbucks', 'cafe coffee day', 'ccd', 'barista', 'third wave',
        'chaayos', 'tea post', 'mao', 'box8', 'faasos', 'behrouz', 'oven story',
        'barbeque nation', 'barbeque', 'punjab grill', 'haldirams', 'bikaner',
        'saravana bhavan', 'udupi', 'vaango', 'id fresh', 'freshmenu',
        // Generic
        'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'biryani', 'dhaba',
        'hotel', 'canteen', 'tiffin', 'mess', 'food', 'dinner', 'lunch', 'breakfast',
        'bakery', 'sweet', 'mithai', 'chaat', 'juice', 'lassi', 'chai', 'tea',
        'bar', 'pub', 'brewery', 'lounge', 'grill', 'kebab', 'diner', 'eatery',
        'thali', 'paratha', 'idli', 'dosa', 'shawarma', 'rolls', 'wrap'
    ],

    'Groceries': [
        // Indian Supermarkets & Apps
        'bigbasket', 'big basket', 'blinkit', 'grofers', 'zepto', 'dunzo', 'instamart',
        'swiggy instamart', 'jiomart', 'reliance fresh', 'reliance smart', 'dmart',
        'more supermarket', 'more retail', 'spencer', 'nature basket', 'foodhall',
        'star bazaar', 'hypercity', 'lulu', 'nilgiris', 'namdhari', 'spar',
        'metro cash', 'easyday', 'heritage fresh',
        // Generic
        'grocery', 'supermarket', 'vegetables', 'fruits', 'dairy', 'milk', 'eggs',
        'provisions', 'kirana', 'ration', 'sabzi', 'market', 'mandi', 'bazaar',
        'masala', 'spices', 'rice', 'dal', 'flour', 'atta', 'oil', 'ghee'
    ],

    'Transport': [
        // Ride-hailing & Rentals
        'uber', 'ola', 'rapido', 'meru', 'jugnu', 'blumart', 'savaari',
        'zoom car', 'zoomcar', 'revv', 'drivezy', 'bounce', 'yulu',
        // Fuel
        'indian oil', 'iocl', 'hp petrol', 'bharat petroleum', 'bpcl', 'hpcl',
        'shell', 'essar', 'petrol', 'diesel', 'fuel', 'cng', 'gas station',
        // Public Transport & Rail
        'irctc', 'indian railways', 'metro', 'bmtc', 'best bus', 'dtc',
        'nmmt', 'ksrtc', 'tnstc', 'msrtc', 'gsrtc', 'red bus', 'redbus',
        'abhibus', 'bus ticket', 'train ticket', 'railway',
        // Air Travel
        'indigo', 'air india', 'spicejet', 'vistara', 'go first', 'akasa',
        'airline', 'flight', 'airport', 'makemytrip', 'goibibo', 'cleartrip',
        'ixigo', 'yatra', 'easemytrip',
        // Parking & Tolls
        'fastag', 'toll', 'parking', 'nhai', 'parking fee',
        // Generic
        'taxi', 'auto', 'rickshaw', 'cab', 'transit', 'commute', 'travel'
    ],

    'Entertainment': [
        // OTT Platforms
        'netflix', 'amazon prime', 'hotstar', 'disney hotstar', 'sony liv', 'sonyliv',
        'zee5', 'voot', 'mxplayer', 'jio cinema', 'jiocinema', 'aha', 'erosnow',
        'hungama', 'altbalaji', 'hoichoi', 'sun nxt',
        // Music
        'spotify', 'gaana', 'wynk', 'jiosaavn', 'saavn', 'apple music', 'youtube premium',
        // Gaming
        'steam', 'playstation', 'xbox', 'nintendo', 'battlegrounds', 'bgmi',
        'google play games', 'mobile legends', 'mpl', 'dream11', 'myteam11',
        // Cinema & Events
        'bookmyshow', 'paytm movies', 'pvr', 'inox', 'cinepolis', 'carnival cinemas',
        'movie', 'cinema', 'theatre', 'multiplex', 'ticket', 'event', 'concert',
        'show', 'play', 'stand up', 'comedy', 'amusement', 'theme park',
        // Sports
        'ipl ticket', 'fantasy sports', 'sport ticket', 'stadium'
    ],

    'Shopping': [
        // E-commerce
        'amazon', 'flipkart', 'myntra', 'meesho', 'snapdeal', 'ajio', 'nykaa',
        'tatacliq', 'tata cliq', 'reliance digital', 'croma', 'vijay sales',
        'shopclues', 'paytm mall', 'jiomart', 'firstcry', 'pepperfry', 'urban ladder',
        // Fashion
        'zara', 'h&m', 'uniqlo', 'pantaloons', 'westside', 'shoppers stop',
        'lifestyle', 'max fashion', 'fbb', 'being human', 'allen solly',
        'van heusen', 'peter england', 'louis philippe', 'raymond', 'manyavar',
        'fabindia', 'biba', 'w for woman', 'global desi', 'anita dongre',
        // Footwear
        'bata', 'liberty', 'metro shoes', 'woodland', 'red tape', 'puma', 'nike',
        'adidas', 'reebok', 'skechers', 'new balance', 'crocs', 'hush puppies',
        // Electronics
        'apple', 'samsung', 'mi store', 'oneplus', 'boat', 'noise', 'imagine',
        'best buy', 'ikea', 'dell', 'hp', 'lenovo', 'asus',
        // Beauty & Personal Care (non-wellness)
        'nykaa', 'purplle', 'sugar cosmetics', 'mac', 'lakme', 'mamaearth',
        'plum', 'wow', 'forest essentials', 'kama ayurveda',
        // Home & Decor
        'ikea', 'pepperfry', 'urban ladder', '@home', 'home centre',
        // Generic
        'mall', 'clothing', 'shoes', 'electronics', 'gadget', 'accessories',
        'jewellery', 'watch', 'bags', 'luggage', 'gift', 'stationery'
    ],

    'Bills & Utilities': [
        // Electricity
        'bescom', 'msedcl', 'tata power', 'adani electricity', 'bses', 'tneb',
        'cesc', 'wbsedcl', 'electricity bill', 'power bill', 'electric',
        // Water & Gas
        'bwssb', 'water bill', 'indraprastha gas', 'mahanagar gas', 'mgl',
        'gujarat gas', 'piped gas', 'lpg', 'indane', 'hp gas', 'bharat gas',
        // Internet & Phone
        'jio', 'airtel', 'vi', 'vodafone idea', 'bsnl', 'act fibernet', 'act',
        'hathway', 'tatasky broadband', 'you broadband', 'den', 'spectranet',
        'recharge', 'mobile bill', 'broadband', 'internet bill', 'postpaid',
        // DTH & Cable
        'tata sky', 'tataplay', 'dish tv', 'sun direct', 'airtel dth', 'videocon d2h',
        'cable tv', 'dth recharge',
        // Rent & Housing
        'rent', 'nobroker', 'housing.com', 'magicbricks', 'maintenance', 'society',
        'apartment', 'pg', 'hostel', 'lease',
        // Insurance
        'lic', 'hdfc life', 'icici prudential', 'sbi life', 'max life',
        'star health', 'niva bupa', 'bajaj allianz', 'new india assurance',
        'national insurance', 'united india', 'care health', 'insurance premium',
        // Generic
        'utility', 'bill payment', 'mortgage', 'emi'
    ],

    'Health & Wellness': [
        // Pharmacy & Delivery
        'apollo pharmacy', 'medplus', 'netmeds', 'pharmeasy', '1mg', 'tata 1mg',
        'practo', 'mfine', 'healthians', 'thyrocare', 'lal path', 'dr lal',
        'metropolis', 'pharmacy', 'medical shop', 'chemist', 'medicine',
        // Hospitals & Clinics
        'apollo hospital', 'fortis', 'manipal hospital', 'narayana health',
        'aster', 'medanta', 'max hospital', 'aiims', 'columbia asia',
        'doctor', 'hospital', 'clinic', 'diagnostic', 'lab test', 'health checkup',
        'consultation', 'specialist',
        // Fitness
        'cult fit', 'cultfit', 'cure fit', 'gold gym', 'anytime fitness',
        'fitness first', 'talwalkars', 'gym', 'fitness', 'yoga', 'zumba',
        'crossfit', 'pilates', 'physiotherapy',
        // Mental Health
        'therapist', 'counseling', 'meditation', 'headspace', 'calm', 'mindhouse',
        // Generic
        'wellness', 'ayurveda', 'homeopathy', 'dental', 'dentist', 'optical',
        'spectacles', 'contact lens', 'lenskart'
    ],

    'Investments & Trading': [
        // Stockbrokers & Trading Platforms
        'zerodha', 'groww', 'upstox', 'angel broking', 'angel one', 'paytm money',
        'icicidirect', 'icici direct', 'hdfc securities', 'kotak securities',
        'motilal oswal', '5paisa', 'sharekhan', 'geojit', 'edelweiss', 'nirmal bang',
        'sbisec', 'sbi securities', 'axis direct', 'dhan', 'fyers', 'mstock',
        // Mutual Funds & SIP
        'smallcase', 'kuvera', 'coin by zerodha', 'mfcentral', 'camsonline',
        'karvy', 'cams', 'franklin templeton', 'mirae asset', 'axis mutual fund',
        'sbi mutual fund', 'hdfc mutual fund', 'icici mutual fund', 'nippon india',
        'kotak mutual fund', 'dsp mutual fund', 'uti mutual fund', 'aditya birla',
        // Generic
        'mutual fund', 'sip', 'stocks', 'shares', 'demat', 'trading', 'equity',
        'nifty', 'sensex', 'ipo', 'portfolio', 'dividend', 'brokerage',
        'gold etf', 'index fund', 'elss', 'nps', 'ppf deposit', 'fd', 'fixed deposit',
        'recurring deposit', 'rd', 'bonds', 'sovereign gold bond', 'sgb'
    ],

    'Loans & EMI': [
        // Banks
        'hdfc bank', 'icici bank', 'sbi loan', 'axis bank loan', 'kotak loan',
        'bajaj finserv', 'bajaj finance', 'tata capital', 'l&t finance',
        'muthoot finance', 'manappuram', 'shriram finance', 'piramal finance',
        'fullerton india', 'aditya birla finance', 'home credit', 'cashe',
        'moneyview', 'navi', 'kreditbee', 'lazypay', 'slice', 'uni cards',
        'early salary', 'stashfin', 'fibe',
        // Generic
        'emi', 'loan', 'loan repayment', 'home loan', 'car loan', 'personal loan',
        'education loan', 'gold loan', 'loan emi', 'equated monthly',
        'prepayment', 'foreclosure', 'part payment', 'loan processing fee',
        'down payment', 'mortgage', 'hypothecation'
    ],

    'Credit Card Bills': [
        // Card Issuers
        'hdfc credit card', 'icici credit card', 'sbi card', 'axis credit card',
        'kotak credit card', 'american express', 'amex', 'citi credit card',
        'indusind credit card', 'yes bank card', 'rbl credit card', 'idfc first card',
        'one card', 'slice card', 'uni card', 'scapia',
        // Generic
        'credit card bill', 'card outstanding', 'minimum due', 'total due',
        'card payment', 'credit card payment', 'card statement', 'revolving credit',
        'credit card emi', 'card emi', 'balance transfer'
    ],

    'Insurance': [
        // Life Insurance
        'lic', 'hdfc life', 'icici prudential', 'sbi life', 'max life',
        'bajaj allianz life', 'tata aia', 'kotak life', 'canara hsbc life',
        'pramerica life', 'edelweiss tokio', 'aegon life', 'pnb metlife',
        // Health Insurance
        'star health', 'niva bupa', 'care health', 'hdfc ergo health',
        'aditya birla health', 'manipal cigna', 'royal sundaram health',
        'religare health',
        // General Insurance
        'new india assurance', 'national insurance', 'united india insurance',
        'oriental insurance', 'bajaj allianz general', 'tata aig', 'icici lombard',
        'hdfc ergo', 'reliance general', 'future generali', 'iffco tokio',
        // Vehicle Insurance
        'vehicle insurance', 'car insurance', 'bike insurance', 'two wheeler insurance',
        'motor insurance', 'acko', 'digit insurance', 'go digit',
        // Generic
        'insurance premium', 'policy renewal', 'life cover', 'term plan',
        'endowment', 'ulip', 'health cover', 'mediclaim', 'floater policy',
        'third party', 'comprehensive cover', 'claim', 'nominee'
    ],

    'Tax & Compliance': [
        // Platforms & Services
        'cleartax', 'taxbuddy', 'tax2win', 'myitreturn', 'quicko',
        'hrblock india', 'ca firm', 'chartered accountant', 'cs firm',
        'indiafilings', 'vakilsearch', 'legalzoom india', 'razorpay rize',
        'startupindia', 'mca portal',
        // Generic
        'tds payment', 'advance tax', 'income tax', 'self assessment tax',
        'gst payment', 'gst filing', 'itr filing', 'tax filing', 'ca fees',
        'audit fees', 'compliance', 'esi', 'pf contribution', 'professional tax',
        'stamp duty', 'registration charges', 'notary', 'apostille'
    ],

    'UPI & Wallet Transfers': [
        // Wallets & UPI Apps
        'paytm', 'phonepe', 'google pay', 'gpay', 'amazon pay', 'mobikwik',
        'freecharge', 'airtel money', 'jio money', 'bhim', 'cred',
        // Generic
        'upi transfer', 'wallet transfer', 'money transfer', 'neft', 'rtgs', 'imps',
        'bank transfer', 'fund transfer', 'send money', 'request money',
        'wallet recharge', 'wallet topup', 'cashback', 'referral bonus'
    ],

    'Banking Charges': [
        // Generic — no specific brands needed here
        'bank charges', 'account maintenance', 'amc', 'annual maintenance',
        'debit card fee', 'credit card fee', 'annual fee', 'joining fee',
        'cheque bounce', 'processing fee', 'late payment fee', 'penalty',
        'interest charged', 'overdraft', 'forex markup', 'currency conversion',
        'atm charges', 'sms charges', 'locker charges', 'dd charges',
        'chequebook charges', 'minimum balance penalty'
    ],

    'Education': [
        // Ed-Tech
        'byjus', 'byju', 'unacademy', 'vedantu', 'upgrad', 'coursera', 'udemy',
        'simplilearn', 'great learning', 'whitehat jr', 'toppr', 'doubtnut',
        'physicswallah', 'pw', 'scaler', 'coding ninjas',
        // Schools & Colleges
        'school fee', 'college fee', 'tuition', 'coaching', 'institute',
        'university fee', 'admission fee', 'examination fee',
        // Books & Supplies
        'amazon books', 'flipkart books', 'crossword', 'higginbothams',
        'book', 'stationery', 'notebook', 'pen', 'pencil', 'supplies',
        // Generic
        'course', 'certification', 'workshop', 'seminar', 'training', 'class'
    ],

    'Travel & Hotels': [
        // Booking Platforms
        'makemytrip', 'goibibo', 'cleartrip', 'yatra', 'ixigo', 'easemytrip',
        'airbnb', 'oyo', 'treebo', 'fabhotels', 'zostel', 'booking.com',
        'agoda', 'hotels.com',
        // Hotels
        'taj hotels', 'oberoi', 'itc hotels', 'leela', 'marriott', 'hyatt',
        'hilton', 'radisson', 'ibis', 'novotel', 'holiday inn', 'lemon tree',
        'hotel', 'resort', 'homestay', 'lodge', 'hostel',
        // Generic
        'vacation', 'holiday', 'trip', 'tour', 'sightseeing', 'visa fee'
    ],

    'Personal Care': [
        // Salons & Spas
        'lakme salon', 'jawed habib', 'naturals salon', 'green trends',
        'toni and guy', 'enrich salon', 'b blunt', 'juice salon',
        'salon', 'spa', 'parlour', 'barbershop', 'haircut', 'facial',
        'massage', 'waxing', 'threading', 'manicure', 'pedicure',
        // Products
        'mamaearth', 'wow', 'plum', 'himalaya', 'dabur', 'patanjali',
        'gillette', 'philips shaver', 'veet', 'nivea', 'dove', 'head shoulders',
        'shampoo', 'conditioner', 'lotion', 'soap', 'deodorant', 'perfume'
    ],

    'Kids & Baby': [
        'firstcry', 'mothercare', 'baby', 'infant', 'toddler', 'toys',
        'hamleys', 'toy', 'kids clothing', 'school supplies', 'diaper',
        'pampers', 'huggies', 'baby food', 'formula', 'pram', 'stroller'
    ],

    'Pets': [
        'dog food', 'cat food', 'pedigree', 'whiskas', 'royal canin',
        'drools', 'vet', 'veterinary', 'pet clinic', 'pet shop', 'petco',
        'dog grooming', 'pet medicine', 'aquarium', 'pet supplies'
    ],

    'Donations & Religious': [
        'temple', 'mosque', 'church', 'gurudwara', 'donation', 'charity',
        'ngo', 'tirupati', 'shirdi', 'dakshina', 'prasad', 'zakat',
        'giveindia', 'milaap', 'ketto', 'crowdfunding'
    ],

    'Subscriptions & SaaS': [
        'notion', 'figma', 'adobe', 'canva', 'slack', 'zoom', 'gsuite',
        'google workspace', 'microsoft 365', 'dropbox', 'github', 'chatgpt',
        'openai', 'linkedin premium', 'subscription', 'membership', 'annual plan'
    ]
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
// List Element
const transactionsList = document.getElementById('transactions-list');

// Dialog Elements
const deleteDialogOverlay = document.getElementById('delete-dialog-overlay');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
let pendingDeleteId = null;

// Initialize Greeting
function initGreeting() {
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let timeGreeting = "Good Evening";

    if (hour >= 5 && hour < 12) {
        timeGreeting = "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        timeGreeting = "Good Afternoon";
    }

    greetingEl.textContent = `${timeGreeting}, Jithendran`;
}

// Internal State
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
let isBalanceHidden = true; // Required by user: hidden by default

// Format Currency
function formatCurrency(amount, withSymbol = true) {
    const numStr = amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return withSymbol ? '₹' + numStr : numStr;
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

// Render Transactions List
function renderTransactions() {
    transactionsList.innerHTML = '';

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<div class="empty-state">No transactions yet.</div>';
        return;
    }

    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Grouping
    const groups = [];
    let currentGroup = null;

    sorted.forEach(tx => {
        const txDate = new Date(tx.date);
        
        let dateKey = txDate.toLocaleDateString('en-IN', { month: 'long', day: '2-digit' });
        
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (txDate.toDateString() === today.toDateString()) {
            dateKey = 'Today';
        } else if (txDate.toDateString() === yesterday.toDateString()) {
            dateKey = 'Yesterday';
        }

        if (!currentGroup || currentGroup.dateKey !== dateKey) {
            currentGroup = { dateKey, netAmount: 0, txs: [] };
            groups.push(currentGroup);
        }

        currentGroup.txs.push(tx);
        if (tx.type === 'income') {
            currentGroup.netAmount += tx.amount;
        } else {
            currentGroup.netAmount -= tx.amount;
        }
    });

    groups.forEach(group => {
        const isNetNegative = group.netAmount < 0;
        const absNet = Math.abs(group.netAmount);
        const netFmt = (isNetNegative ? '-₹' : '₹') + absNet.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        
        const groupCard = document.createElement('div');
        groupCard.className = 'tx-date-group-card';
        
        const groupHeader = document.createElement('div');
        groupHeader.className = 'tx-group-header';
        groupHeader.innerHTML = `
            <h3>${group.dateKey}</h3>
            <span class="group-net-amt">${netFmt}</span>
        `;
        groupCard.appendChild(groupHeader);

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'tx-items-list';

        group.txs.forEach(tx => {
            const isExpense = tx.type === 'expense';
            const formattedAmount = (isExpense ? '-₹' : '+₹') + Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            
            const timeStr = new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const catOrIncome = tx.type === 'income' ? 'Income' : tx.category;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'tx-list-item';
            
            itemDiv.innerHTML = `
                <div class="tx-item-main" data-id="${tx.id}">
                    <div class="tx-item-details">
                        <div class="tx-item-title">${tx.place}</div>
                        <div class="tx-item-category">
                            <span>${catOrIncome}</span>
                        </div>
                    </div>
                    <div class="tx-item-values">
                        <div class="tx-item-amt ${isExpense ? 'expense' : 'income'}">${formattedAmount}</div>
                        <div class="tx-item-time">${timeStr}</div>
                    </div>
                </div>
                <div class="tx-item-expanded" id="expanded-${tx.id}">
                    <div class="expanded-content">
                        <div class="expanded-info">
                            <span class="info-label">Date</span>
                            <span class="info-value">${new Date(tx.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                        </div>
                        ${tx.coordinates ? `
                        <div class="expanded-info">
                            <span class="info-label">Location</span>
                            <a href="https://www.google.com/maps/search/?api=1&query=${tx.coordinates.lat},${tx.coordinates.lng}" target="_blank" class="info-value link">View Map</a>
                        </div>
                        ` : ''}
                        <button type="button" class="action-btn delete-action-btn" data-id="${tx.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            Delete Expense
                        </button>
                    </div>
                </div>
            `;
            itemsContainer.appendChild(itemDiv);
        });

        groupCard.appendChild(itemsContainer);
        transactionsList.appendChild(groupCard);
    });
}

// Handle row actions (Accordion & Delete)
transactionsList.addEventListener('click', (e) => {
    // Check if delete button was clicked
    const deleteBtn = e.target.closest('.delete-action-btn');
    if (deleteBtn) {
        e.stopPropagation();
        pendingDeleteId = parseInt(deleteBtn.getAttribute('data-id'));
        deleteDialogOverlay.classList.add('active');
        return;
    }

    // Check if main row was clicked for accordion
    const txItemMain = e.target.closest('.tx-item-main');
    if (txItemMain) {
        const id = txItemMain.getAttribute('data-id');
        const expandedDiv = document.getElementById(`expanded-${id}`);
        
        // Auto-close siblings
        document.querySelectorAll('.tx-item-expanded.active').forEach(el => {
            if (el !== expandedDiv) el.classList.remove('active');
        });

        if (expandedDiv) {
            expandedDiv.classList.toggle('active');
        }
    }
});

cancelDeleteBtn.addEventListener('click', () => {
    pendingDeleteId = null;
    deleteDialogOverlay.classList.remove('active');
});

confirmDeleteBtn.addEventListener('click', () => {
    if (pendingDeleteId !== null) {
        transactions = transactions.filter(tx => tx.id !== pendingDeleteId);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateBalance();
        renderTransactions();
        showToast('Item deleted successfully.');
        pendingDeleteId = null;
        deleteDialogOverlay.classList.remove('active');
    }
});

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
        // Try getting accurate device location first
        coordinates = await new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported"));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
            );
        });
    } catch (geoErr) {
        console.log("Device geolocation failed, falling back to OSM search.", geoErr);
        try {
            // Use OpenStreetMap Nominatim to geocode the inputted place string as fallback
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
