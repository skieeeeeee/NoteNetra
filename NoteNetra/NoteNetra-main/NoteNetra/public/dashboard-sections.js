// Dashboard Sections Handler
import { ref, onValue, set, push } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

export class DashboardSections {
    constructor(db, currentUser) {
        this.db = db;
        this.currentUser = currentUser;
        this.charts = {};
        this.init();
    }

    init() {
        this.createSections();
        this.setupEventListeners();
        this.loadUserDataIntoForms();
    }

    createSections() {
        const contentSections = document.getElementById('content-sections');
        
        // Analytics Section
        contentSections.innerHTML += `
            <div id="analytics-section" class="content-section">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-charcoal-800 mb-2">Analytics</h2>
                    <p class="text-charcoal-600">Detailed insights into your business performance.</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="text-xl font-bold text-charcoal-800 mb-6">Monthly Sales</h3>
                        <div class="h-80">
                            <canvas id="monthlySalesChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="text-xl font-bold text-charcoal-800 mb-6">Transaction Types</h3>
                        <div class="h-80">
                            <canvas id="transactionTypesChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // QR Payments Section
        contentSections.innerHTML += `
            <div id="qr-payments-section" class="content-section">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-charcoal-800 mb-2">QR Payments</h2>
                    <p class="text-charcoal-600">Your personal QR code for accepting payments.</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white rounded-2xl p-8 shadow-lg text-center">
                        <div class="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
                            <div class="text-center">
                                <i class="fas fa-qrcode text-6xl text-charcoal-400 mb-4"></i>
                                <p class="text-charcoal-600">QR Code will be generated here</p>
                            </div>
                        </div>
                        <h3 class="text-xl font-bold text-charcoal-800 mb-4">Your Payment QR</h3>
                        <p class="text-charcoal-600 mb-6">Share this QR code with customers to accept payments instantly.</p>
                        <div class="space-y-3">
                            <button class="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200">
                                <i class="fas fa-download mr-2"></i>Download QR
                            </button>
                            <button class="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200">
                                <i class="fas fa-share mr-2"></i>Share QR
                            </button>
                            <button class="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                                <i class="fas fa-copy mr-2"></i>Copy Link
                            </button>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 class="text-xl font-bold text-charcoal-800 mb-6">QR Payment History</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-charcoal-50 rounded-lg">
                                <div>
                                    <p class="font-medium text-charcoal-800">Payment Received</p>
                                    <p class="text-sm text-charcoal-600">From Customer</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-semibold text-green-600">+₹5,000</p>
                                    <p class="text-sm text-charcoal-600">2 hours ago</p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between p-4 bg-charcoal-50 rounded-lg">
                                <div>
                                    <p class="font-medium text-charcoal-800">Payment Received</p>
                                    <p class="text-sm text-charcoal-600">From Customer</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-semibold text-green-600">+₹2,500</p>
                                    <p class="text-sm text-charcoal-600">4 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Transactions Section
        contentSections.innerHTML += `
            <div id="transactions-section" class="content-section">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-charcoal-800 mb-2">All Transactions</h2>
                    <p class="text-charcoal-600">Complete history of all your transactions.</p>
                </div>
                
                <div class="bg-white rounded-2xl shadow-lg">
                    <div class="p-6 border-b border-charcoal-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-bold text-charcoal-800">Transaction History</h3>
                            <div class="flex space-x-2">
                                <select class="px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                    <option>All Transactions</option>
                                    <option>Received</option>
                                    <option>Sent</option>
                                </select>
                                <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                    <i class="fas fa-download mr-2"></i>Export
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-charcoal-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-charcoal-700">Transaction ID</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-charcoal-700">Type</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-charcoal-700">Amount</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-charcoal-700">Status</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-charcoal-700">Date</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold text-charcoal-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-charcoal-200" id="all-transactions">
                                <!-- Transactions will be populated here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Workspace Section
        contentSections.innerHTML += `
            <div id="workspace-section" class="content-section">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-charcoal-800 mb-2">Workspace</h2>
                    <p class="text-charcoal-600">Manage your connected companies and business network.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-charcoal-800">Connected Companies</h3>
                            <span class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">3 Active</span>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-3 bg-charcoal-50 rounded-lg">
                                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-semibold">A</div>
                                <div class="flex-1">
                                    <p class="font-medium text-charcoal-800">ABC Distributors</p>
                                    <p class="text-sm text-charcoal-600">Mumbai, Maharashtra</p>
                                </div>
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-charcoal-50 rounded-lg">
                                <div class="w-10 h-10 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold">P</div>
                                <div class="flex-1">
                                    <p class="font-medium text-charcoal-800">Premium Suppliers</p>
                                    <p class="text-sm text-charcoal-600">Delhi, NCR</p>
                                </div>
                                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-charcoal-800">Pending Requests</h3>
                            <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">2 Pending</span>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-3 bg-charcoal-50 rounded-lg">
                                <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-semibold">M</div>
                                <div class="flex-1">
                                    <p class="font-medium text-charcoal-800">Metro Cash & Carry</p>
                                    <p class="text-sm text-charcoal-600">Chennai, Tamil Nadu</p>
                                </div>
                                <div class="space-x-2">
                                    <button class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Accept</button>
                                    <button class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Decline</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="text-lg font-bold text-charcoal-800 mb-4">Request Connection</h3>
                        <form class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-charcoal-700 mb-2">Company Name</label>
                                <input type="text" class="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-charcoal-700 mb-2">Email</label>
                                <input type="email" class="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-charcoal-700 mb-2">Message</label>
                                <textarea rows="3" class="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200">
                                Send Request
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Network Section
        contentSections.innerHTML += `
            <div id="network-section" class="content-section">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-charcoal-800 mb-2">Network</h2>
                    <p class="text-charcoal-600">Discover and connect with nearby businesses.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="text-lg font-bold text-charcoal-800 mb-4">Nearby Businesses</h3>
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-3 bg-charcoal-50 rounded-lg">
                                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-semibold">K</div>
                                <div class="flex-1">
                                    <p class="font-medium text-charcoal-800">Kumar Groceries</p>
                                    <p class="text-sm text-charcoal-600">0.5 km away</p>
                                </div>
                                <button class="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">Connect</button>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-charcoal-50 rounded-lg">
                                <div class="w-10 h-10 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold">S</div>
                                <div class="flex-1">
                                    <p class="font-medium text-charcoal-800">Sharma Electronics</p>
                                    <p class="text-sm text-charcoal-600">1.2 km away</p>
                                </div>
                                <button class="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">Connect</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="text-lg font-bold text-charcoal-800 mb-4">Network Statistics</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg text-white">
                                <div>
                                    <p class="text-sm opacity-90">Total Connections</p>
                                    <p class="text-2xl font-bold">15</p>
                                </div>
                                <i class="fas fa-users text-2xl opacity-80"></i>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg text-white">
                                <div>
                                    <p class="text-sm opacity-90">Active Partners</p>
                                    <p class="text-2xl font-bold">8</p>
                                </div>
                                <i class="fas fa-handshake text-2xl opacity-80"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 class="text-lg font-bold text-charcoal-800 mb-4">Network Map</h3>
                        <div class="w-full h-48 bg-charcoal-100 rounded-lg flex items-center justify-center">
                            <div class="text-center">
                                <i class="fas fa-map text-4xl text-charcoal-400 mb-2"></i>
                                <p class="text-charcoal-600">Interactive map will be displayed here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Access Score Section
        contentSections.innerHTML += `
            <div id="access-score-section" class="content-section">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-charcoal-800 mb-2">Access Score</h2>
                    <p class="text-charcoal-600">Your business creditworthiness and access to financial services.</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white rounded-2xl p-8 shadow-lg">
                        <div class="text-center mb-8">
                            <div class="w-32 h-32 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4" id="score-display">4/5</div>
                            <h3 class="text-2xl font-bold text-charcoal-800 mb-2">Excellent Score</h3>
                            <p class="text-charcoal-600">You have excellent access to financial services</p>
                        </div>
                        
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-charcoal-700">Monthly Sales</span>
                                <span class="font-semibold text-green-600">+2 points</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-charcoal-700">Transaction Volume</span>
                                <span class="font-semibold text-green-600">+1 point</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-charcoal-700">Payment History</span>
                                <span class="font-semibold text-green-600">+1 point</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 class="text-xl font-bold text-charcoal-800 mb-6">Score Breakdown</h3>
                        <div class="space-y-6">
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-charcoal-700">Sales Performance</span>
                                    <span class="text-sm font-semibold text-green-600">85%</span>
                                </div>
                                <div class="w-full bg-charcoal-200 rounded-full h-2">
                                    <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-charcoal-700">Transaction Frequency</span>
                                    <span class="text-sm font-semibold text-green-600">92%</span>
                                </div>
                                <div class="w-full bg-charcoal-200 rounded-full h-2">
                                    <div class="bg-green-500 h-2 rounded-full" style="width: 92%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-charcoal-700">Payment Reliability</span>
                                    <span class="text-sm font-semibold text-green-600">78%</span>
                                </div>
                                <div class="w-full bg-charcoal-200 rounded-full h-2">
                                    <div class="bg-green-500 h-2 rounded-full" style="width: 78%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Settings Section
        contentSections.innerHTML += `
            <div id="settings-section" class="content-section">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-charcoal-800 mb-2">Settings</h2>
                    <p class="text-charcoal-600">Manage your profile and account settings.</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 class="text-xl font-bold text-charcoal-800 mb-6">Profile Information</h3>
                        <form id="profile-form" class="space-y-6">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-charcoal-700 mb-2">First Name</label>
                                    <input type="text" id="firstName" class="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-charcoal-700 mb-2">Last Name</label>
                                    <input type="text" id="lastName" class="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-charcoal-700 mb-2">Email</label>
                                <input type="email" id="email" class="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-charcoal-700 mb-2">Phone Number</label>
                                <input type="tel" id="phone" class="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-charcoal-700 mb-2">Business Name</label>
                                <input type="text" id="businessName" class="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-charcoal-700 mb-2">UPI ID</label>
                                <input type="text" id="upiId" class="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="username@upi">
                            </div>
                            <button type="submit" class="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200">
                                Update Profile
                            </button>
                        </form>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 class="text-xl font-bold text-charcoal-800 mb-6">Account Settings</h3>
                        <div class="space-y-6">
                            <div class="flex items-center justify-between p-4 bg-charcoal-50 rounded-lg">
                                <div>
                                    <h4 class="font-medium text-charcoal-800">Email Notifications</h4>
                                    <p class="text-sm text-charcoal-600">Receive email updates about transactions</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer" checked>
                                    <div class="w-11 h-6 bg-charcoal-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                            <div class="flex items-center justify-between p-4 bg-charcoal-50 rounded-lg">
                                <div>
                                    <h4 class="font-medium text-charcoal-800">SMS Notifications</h4>
                                    <p class="text-sm text-charcoal-600">Receive SMS for important updates</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer">
                                    <div class="w-11 h-6 bg-charcoal-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Help Section
        contentSections.innerHTML += `
            <div id="help-section" class="content-section">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-charcoal-800 mb-2">Help & Support</h2>
                    <p class="text-charcoal-600">Get help and contact our support team.</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 class="text-xl font-bold text-charcoal-800 mb-6">Frequently Asked Questions</h3>
                        <div class="space-y-4">
                            <div class="border border-charcoal-200 rounded-lg">
                                <button class="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-charcoal-50 transition-colors">
                                    <span class="font-medium text-charcoal-800">How do I generate a QR code?</span>
                                    <i class="fas fa-chevron-down text-charcoal-600"></i>
                                </button>
                                <div class="px-4 pb-3">
                                    <p class="text-charcoal-600">Go to the QR Payments section and click on "Generate QR Code". Your unique QR code will be created instantly.</p>
                                </div>
                            </div>
                            <div class="border border-charcoal-200 rounded-lg">
                                <button class="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-charcoal-50 transition-colors">
                                    <span class="font-medium text-charcoal-800">How is my Access Score calculated?</span>
                                    <i class="fas fa-chevron-down text-charcoal-600"></i>
                                </button>
                                <div class="px-4 pb-3">
                                    <p class="text-charcoal-600">Your Access Score is based on your monthly sales, transaction frequency, payment reliability, and business growth.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 class="text-xl font-bold text-charcoal-800 mb-6">Contact Support</h3>
                        <form id="support-form" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-charcoal-700 mb-2">Subject</label>
                                <select class="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                    <option>General Inquiry</option>
                                    <option>Technical Issue</option>
                                    <option>Payment Problem</option>
                                    <option>Account Issue</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-charcoal-700 mb-2">Message</label>
                                <textarea rows="4" class="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Describe your issue..."></textarea>
                            </div>
                            <button type="submit" class="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200">
                                Send Message
                            </button>
                        </form>
                        
                        <div class="mt-8 pt-6 border-t border-charcoal-200">
                            <h4 class="font-medium text-charcoal-800 mb-4">Other Ways to Reach Us</h4>
                            <div class="space-y-3">
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-envelope text-indigo-600"></i>
                                    <span class="text-charcoal-600">support@notenetra.com</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-phone text-indigo-600"></i>
                                    <span class="text-charcoal-600">+91 98765 43210</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <i class="fas fa-clock text-indigo-600"></i>
                                    <span class="text-charcoal-600">24/7 Support Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Profile form submission
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // Support form submission
        const supportForm = document.getElementById('support-form');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitSupportRequest();
            });
        }
    }

    async updateProfile() {
        try {
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                phone: document.getElementById('phone').value,
                businessName: document.getElementById('businessName').value,
                upiId: document.getElementById('upiId').value,
                updatedAt: new Date().toISOString()
            };

            const userRef = ref(this.db, 'users/' + this.currentUser.uid);
            await set(userRef, { ...this.userData, ...formData });

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    }

    async submitSupportRequest() {
        try {
            const supportRef = ref(this.db, 'support/' + this.currentUser.uid);
            const newSupportRef = push(supportRef);
            
            await set(newSupportRef, {
                subject: document.querySelector('#support-form select').value,
                message: document.querySelector('#support-form textarea').value,
                userId: this.currentUser.uid,
                userEmail: this.currentUser.email,
                createdAt: new Date().toISOString(),
                status: 'pending'
            });

            alert('Support request submitted successfully! We\'ll get back to you soon.');
            document.getElementById('support-form').reset();
        } catch (error) {
            console.error('Error submitting support request:', error);
            alert('Error submitting support request. Please try again.');
        }
    }

    loadUserDataIntoForms() {
        if (this.userData) {
            document.getElementById('firstName').value = this.userData.firstName || '';
            document.getElementById('lastName').value = this.userData.lastName || '';
            document.getElementById('email').value = this.currentUser.email;
            document.getElementById('phone').value = this.userData.phone || '';
            document.getElementById('businessName').value = this.userData.businessName || '';
            document.getElementById('upiId').value = this.userData.upiId || '';
        }
    }

    initializeCharts() {
        // Monthly Sales Chart
        const monthlySalesCtx = document.getElementById('monthlySalesChart');
        if (monthlySalesCtx) {
            this.charts.monthlySales = new Chart(monthlySalesCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Sales',
                        data: [65000, 72000, 68000, 85000, 92000, 88000],
                        backgroundColor: '#6366f1',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#e2e8f0'
                            },
                            ticks: {
                                color: '#64748b'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#64748b'
                            }
                        }
                    }
                }
            });
        }

        // Transaction Types Chart
        const transactionTypesCtx = document.getElementById('transactionTypesChart');
        if (transactionTypesCtx) {
            this.charts.transactionTypes = new Chart(transactionTypesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['QR Payments', 'Bank Transfer', 'Cash', 'Card'],
                    datasets: [{
                        data: [45, 25, 20, 10],
                        backgroundColor: [
                            '#6366f1',
                            '#14b8a6',
                            '#f59e0b',
                            '#ef4444'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#64748b'
                            }
                        }
                    }
                }
            });
        }
    }
} 