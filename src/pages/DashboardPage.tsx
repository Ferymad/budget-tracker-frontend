import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  Target,
  PieChart,
  Plus
} from 'lucide-react';
import { Card, Button, Loading, Alert } from '@/components/ui';
import { useApi } from '@/hooks';
import { useCircuitBreaker } from '@/hooks/useCircuitBreaker';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { transactionService, budgetService } from '@/services';
import { formatCurrency, formatDate } from '@/utils';
import { Transaction, BudgetProgress } from '@/types';

const DashboardPage: React.FC = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budgetProgress, setBudgetProgress] = useState<BudgetProgress[]>([]);
  
  // Circuit breaker for API calls
  const circuitBreaker = useCircuitBreaker({
    failureThreshold: 3,
    recoveryTimeMs: 15000,
    requestTimeoutMs: 5000,
  });
  
  // Performance monitoring
  const { getMetrics } = usePerformanceMonitor('DashboardPage', (alert) => {
    console.error('Dashboard Performance Alert:', alert);
    
    // If high frequency detected, show user warning
    if (alert.type === 'high_frequency') {
      console.warn('Too many requests detected. Please refresh the page if data seems stuck.');
    }
  });

  // Fetch dashboard stats with circuit breaker protection
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    execute: refetchStats,
  } = useApi(() => 
    circuitBreaker.execute(() => transactionService.getTransactionStats()),
    { immediate: true }
  );

  // Load recent transactions and budget progress
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get recent transactions (last 5)
        const transactions = await transactionService.getTransactions({ limit: 5 });
        setRecentTransactions(transactions);

        // Get budget progress
        const budgets = await budgetService.getBudgetProgress();
        setBudgetProgress(budgets);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (statsError) {
    const circuitState = circuitBreaker.getState();
    const isCircuitOpen = circuitState.state === 'OPEN';
    
    return (
      <div className="space-y-4">
        <Alert variant="error" className="mb-6">
          Failed to load dashboard data: {statsError}
          {isCircuitOpen && (
            <div className="mt-2 text-sm">
              ⚠️ System protection activated. Retrying automatically in {Math.round((circuitState.nextAttemptTime - Date.now()) / 1000)}s
            </div>
          )}
        </Alert>
        {!isCircuitOpen && (
          <div className="flex justify-center">
            <button
              onClick={() => refetchStats()}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Retry Loading
            </button>
          </div>
        )}
      </div>
    );
  }

  const netIncome = parseFloat(stats?.net_income || '0');
  const isPositive = netIncome >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/transactions/new">
            <Button className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Income</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats?.total_income || '0')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="h-8 w-8 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats?.total_expenses || '0')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className={`h-8 w-8 ${isPositive ? 'text-success-600' : 'text-danger-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Net Income</p>
              <p className={`text-2xl font-semibold ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                {formatCurrency(stats?.net_income || '0')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.transaction_count || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
              <Link
                to="/transactions"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding your first transaction.
                </p>
                <div className="mt-6">
                  <Link to="/transactions/new">
                    <Button size="sm">Add Transaction</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.transaction_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.transaction_type === 'income' 
                          ? 'text-success-600' 
                          : 'text-danger-600'
                      }`}>
                        {transaction.transaction_type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {transaction.transaction_type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Budget Progress */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Budget Progress</h3>
              <Link
                to="/budgets"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            {budgetProgress.length === 0 ? (
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No budgets</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first budget to track spending goals.
                </p>
                <div className="mt-6">
                  <Link to="/budgets/new">
                    <Button size="sm">Create Budget</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {budgetProgress.slice(0, 3).map((budget) => (
                  <div key={budget.budget_id}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-900">
                        {budget.budget_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(budget.spent_amount)} / {formatCurrency(budget.budget_amount)}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          budget.is_over_budget 
                            ? 'bg-danger-600' 
                            : budget.percentage_used > 80 
                            ? 'bg-warning-500' 
                            : 'bg-success-600'
                        }`}
                        style={{
                          width: `${Math.min(budget.percentage_used, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {budget.percentage_used.toFixed(1)}% used
                      {budget.is_over_budget && ' (Over budget!)'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/transactions/new"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <CreditCard className="h-8 w-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Transaction</span>
            </Link>
            <Link
              to="/categories/new"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <PieChart className="h-8 w-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Category</span>
            </Link>
            <Link
              to="/budgets/new"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Target className="h-8 w-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Create Budget</span>
            </Link>
            <Link
              to="/reports"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">View Reports</span>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DashboardPage;