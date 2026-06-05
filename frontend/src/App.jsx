import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TablesPage from './pages/TablesPage';
import OrderPage from './pages/OrderPage';
import MenuPage from './pages/MenuPage';
import KitchenPage from './pages/KitchenPage';
import PaymentPage from './pages/PaymentPage';
import PaymentsPage from './pages/PaymentsPage';
import AboutPage from './pages/AboutPage';
import './styles/global.css';

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      {token && <Navbar />}
      <div className={token ? 'app-content' : 'app-content-auth'}>
        <Routes>
          <Route
            path="/login"
            element={token ? <Navigate to="/tables" replace /> : <LoginPage />}
          />

          <Route
            path="/register"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RegisterPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tables"
            element={
              <ProtectedRoute allowedRoles={['admin', 'waiter']}>
                <TablesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:tableId"
            element={
              <ProtectedRoute allowedRoles={['admin', 'waiter', 'cashier']}>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/menu"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MenuPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kitchen"
            element={
              <ProtectedRoute allowedRoles={['admin', 'waiter']}>
                <KitchenPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/:orderId"
            element={
              <ProtectedRoute allowedRoles={['admin', 'cashier', 'waiter']}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          {/* Rreth Nesh — i aksesueshëm nga të gjithë rolet */}
          <Route
            path="/about"
            element={
              <ProtectedRoute allowedRoles={['admin', 'waiter', 'cashier']}>
                <AboutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={<Navigate to={token ? '/tables' : '/login'} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={token ? '/tables' : '/login'} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
