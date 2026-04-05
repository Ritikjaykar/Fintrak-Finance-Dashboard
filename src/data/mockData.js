export const CATEGORIES = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Travel', 'Salary', 'Freelance', 'Investment'];

export const CATEGORY_COLORS = {
  'Food & Dining': '#F97316',
  'Transportation': '#3B82F6',
  'Shopping': '#A855F7',
  'Entertainment': '#EC4899',
  'Bills & Utilities': '#EF4444',
  'Healthcare': '#10B981',
  'Travel': '#F59E0B',
  'Salary': '#22C55E',
  'Freelance': '#06B6D4',
  'Investment': '#8B5CF6',
};

export const generateTransactions = () => {
  const transactions = [
    { id: 1, date: '2026-04-01', description: 'Monthly Salary', category: 'Salary', amount: 85000, type: 'income' },
    { id: 2, date: '2026-04-01', description: 'Swiggy Order', category: 'Food & Dining', amount: -342, type: 'expense' },
    { id: 3, date: '2026-04-02', description: 'Ola Cab', category: 'Transportation', amount: -180, type: 'expense' },
    { id: 4, date: '2026-04-02', description: 'Amazon Shopping', category: 'Shopping', amount: -2340, type: 'expense' },
    { id: 5, date: '2026-04-03', description: 'Netflix Subscription', category: 'Entertainment', amount: -649, type: 'expense' },
    { id: 6, date: '2026-04-03', description: 'Electricity Bill', category: 'Bills & Utilities', amount: -1200, type: 'expense' },
    { id: 7, date: '2026-04-04', description: 'Freelance Project - UI Design', category: 'Freelance', amount: 12000, type: 'income' },
    { id: 8, date: '2026-04-04', description: 'Pharmacy', category: 'Healthcare', amount: -850, type: 'expense' },
    { id: 9, date: '2026-04-05', description: 'Zomato Order', category: 'Food & Dining', amount: -520, type: 'expense' },
    { id: 10, date: '2026-04-05', description: 'Metro Card Recharge', category: 'Transportation', amount: -500, type: 'expense' },
    { id: 11, date: '2026-04-06', description: 'Flight Ticket - Mumbai', category: 'Travel', amount: -4500, type: 'expense' },
    { id: 12, date: '2026-04-07', description: 'SIP - Mutual Fund', category: 'Investment', amount: -5000, type: 'expense' },
    { id: 13, date: '2026-03-01', description: 'Monthly Salary', category: 'Salary', amount: 85000, type: 'income' },
    { id: 14, date: '2026-03-03', description: 'Grocery Store', category: 'Food & Dining', amount: -1800, type: 'expense' },
    { id: 15, date: '2026-03-05', description: 'Petrol', category: 'Transportation', amount: -2000, type: 'expense' },
    { id: 16, date: '2026-03-08', description: 'Myntra Shopping', category: 'Shopping', amount: -3200, type: 'expense' },
    { id: 17, date: '2026-03-10', description: 'Movie Tickets', category: 'Entertainment', amount: -900, type: 'expense' },
    { id: 18, date: '2026-03-12', description: 'Internet Bill', category: 'Bills & Utilities', amount: -999, type: 'expense' },
    { id: 19, date: '2026-03-15', description: 'Freelance - App Dev', category: 'Freelance', amount: 18000, type: 'income' },
    { id: 20, date: '2026-03-18', description: 'Doctor Visit', category: 'Healthcare', amount: -500, type: 'expense' },
    { id: 21, date: '2026-03-20', description: 'Goa Trip Expenses', category: 'Travel', amount: -12000, type: 'expense' },
    { id: 22, date: '2026-03-22', description: 'Stock Purchase', category: 'Investment', amount: -10000, type: 'expense' },
    { id: 23, date: '2026-03-25', description: 'Restaurant Dinner', category: 'Food & Dining', amount: -1200, type: 'expense' },
    { id: 24, date: '2026-03-28', description: 'Dividend Income', category: 'Investment', amount: 2400, type: 'income' },
    { id: 25, date: '2026-02-01', description: 'Monthly Salary', category: 'Salary', amount: 85000, type: 'income' },
    { id: 26, date: '2026-02-03', description: 'Swiggy Order', category: 'Food & Dining', amount: -450, type: 'expense' },
    { id: 27, date: '2026-02-05', description: 'Uber Cab', category: 'Transportation', amount: -320, type: 'expense' },
    { id: 28, date: '2026-02-08', description: 'Flipkart Order', category: 'Shopping', amount: -5600, type: 'expense' },
    { id: 29, date: '2026-02-10', description: 'Spotify Premium', category: 'Entertainment', amount: -119, type: 'expense' },
    { id: 30, date: '2026-02-12', description: 'Gas Bill', category: 'Bills & Utilities', amount: -650, type: 'expense' },
    { id: 31, date: '2026-02-14', description: 'Valentine Dinner', category: 'Food & Dining', amount: -2800, type: 'expense' },
    { id: 32, date: '2026-02-18', description: 'Gym Membership', category: 'Healthcare', amount: -2000, type: 'expense' },
    { id: 33, date: '2026-02-20', description: 'Freelance - Website', category: 'Freelance', amount: 15000, type: 'income' },
    { id: 34, date: '2026-02-22', description: 'Hotel Booking', category: 'Travel', amount: -3500, type: 'expense' },
    { id: 35, date: '2026-02-25', description: 'SIP - Mutual Fund', category: 'Investment', amount: -5000, type: 'expense' },
  ];
  return transactions;
};

export const getMonthlyData = (transactions) => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const baseData = [
    { month: 'Oct', income: 87000, expenses: 32000 },
    { month: 'Nov', income: 85000, expenses: 38000 },
    { month: 'Dec', income: 97000, expenses: 52000 },
    { month: 'Jan', income: 85000, expenses: 28000 },
    { month: 'Feb', income: 100000, expenses: 19439 },
    { month: 'Mar', income: 105400, expenses: 31599 },
    { month: 'Apr', income: 97000, expenses: 10281 },
  ];
  return baseData;
};
