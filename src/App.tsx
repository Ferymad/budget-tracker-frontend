import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout, ProtectedRoute } from '@/components/layout';
import { 
  LoginPage, 
  RegisterPage, 
  DashboardPage 
} from '@/pages';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Placeholder routes for future implementation */}
            <Route 
              path="/transactions/*" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Transactions
                      </h2>
                      <p className="text-gray-600">
                        Transaction management features coming soon...
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/categories/*" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Categories
                      </h2>
                      <p className="text-gray-600">
                        Category management features coming soon...
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/budgets/*" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Budgets
                      </h2>
                      <p className="text-gray-600">
                        Budget management features coming soon...
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Profile Settings
                      </h2>
                      <p className="text-gray-600">
                        Profile management features coming soon...
                      </p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;