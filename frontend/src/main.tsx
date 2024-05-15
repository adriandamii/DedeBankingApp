import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/layout/Layout';
import {AdminCreate} from './pages/admin/initialization/AdminCreate';
import {AdminSendPass} from './pages/admin/initialization/AdminSendPass';
import {AdminLogin} from './pages/admin/initialization/AdminLogin';
import { Provider } from 'react-redux';
import { store } from './app/store';
import UsersList from './pages/admin/dashboard/users/UsersList';
import './index.css';
import { UserDetails } from './pages/admin/dashboard/users/UserDetails';
import { UserAccounts } from './pages/admin/dashboard/accounts/UserAccounts';
import AccountDetails from './pages/admin/dashboard/accounts/AccountDetails';
import Transaction from './pages/admin/dashboard/transactions/Transaction';
import Deposit from './pages/admin/dashboard/cashFlows/deposits/Deposit';
import TransactionAction from './pages/admin/dashboard/transactions/TransactionAction';
import DepositAction from './pages/admin/dashboard/cashFlows/deposits/DepositAction';
import DepositHistory from './pages/admin/dashboard/cashFlows/deposits/DepositHistory';
import TransactionHistory from './pages/admin/dashboard/transactions/TransactionHistory';
import CashFlowHistory from './pages/admin/dashboard/cashFlows/CashFlowHistory';
import CreateUser from './pages/admin/dashboard/users/CreateUser';
import EditUser from './pages/admin/dashboard/users/EditUser';
import CreateAccount from './pages/admin/dashboard/accounts/CreateAccount';
import UserSetPin from './pages/customer/initialization/UserSetPin';
import UserLogin from './pages/customer/initialization/UserLogin';
import ForgotPin from './pages/customer/resetAndForgotPin/ForgotPin';
import ResetPin from './pages/customer/resetAndForgotPin/ResetPin';
import SearchPage from './pages/admin/dashboard/search/SearchPage';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './features/protectedRoutes/ProtectedRoute';
import Withdrawal from './pages/admin/dashboard/cashFlows/withdrawals/Withdrawal';
import WithdrawalAction from './pages/admin/dashboard/cashFlows/withdrawals/WithdrawalAction';
import WithdrawalHistory from './pages/admin/dashboard/cashFlows/withdrawals/WithdrawalHistory';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      //admin initialization
      { path: "admin/create", element: <AdminCreate /> },
      { path: "admin/send-login-password", element: <AdminSendPass />},
      { path: "admin/login", element: <AdminLogin /> },
      
      //public routes (client useful routes)
      { path: "forgot-pin", element: <ForgotPin /> },
      { path: "login", element: <UserLogin />},
      { path: "reset-pin/:token", element: <ResetPin /> },
      { path: "set-pin/:token", element: <UserSetPin />},

      //admin
      { path: 'admin/create-user', element: <ProtectedRoute element={<CreateUser />} /> },
      { path: "users/:userId/accounts/create", element: <ProtectedRoute element={<CreateAccount />} /> },
      { path: "users", element: <ProtectedRoute element={ <UsersList />} />},
      { path: "search", element: <ProtectedRoute element={<SearchPage /> } />},
      { path: "users/:userId/edit-user", element: <ProtectedRoute element={<EditUser />} /> },
      
      //admin and client
      { path: "users/:userId", element: <ProtectedRoute element={<UserDetails/> } /> },
      { path: "users/:userId/accounts", element: <ProtectedRoute element={<UserAccounts /> }/>},
      { path: "users/:userId/accounts/:accountId", element: <ProtectedRoute element={<AccountDetails />} /> },
      { path: "account/:uniqueAccountNumber/cashflow-history", element: <ProtectedRoute element={<CashFlowHistory />} /> },
      { path: "account/:uniqueAccountNumber/transaction", element: <ProtectedRoute element={<Transaction />} /> },
      { path: "account/:uniqueAccountNumber/transaction/action", element: <ProtectedRoute element={<TransactionAction />} /> },
      { path: "account/:uniqueAccountNumber/transaction/history", element: <ProtectedRoute element={<TransactionHistory />} /> },
      { path: "account/:uniqueAccountNumber/withdrawal", element: <ProtectedRoute element={<Withdrawal />} /> },
      { path: "account/:uniqueAccountNumber/withdrawal/action", element: <ProtectedRoute element={<WithdrawalAction />} /> },
      { path: "account/:uniqueAccountNumber/withdrawal/history", element: <ProtectedRoute element={<WithdrawalHistory />} /> },
      { path: "account/:uniqueAccountNumber/deposit", element: <ProtectedRoute element={<Deposit />} /> },
      { path: "account/:uniqueAccountNumber/deposit/action", element: <ProtectedRoute element={<DepositAction />} /> },
      { path: "account/:uniqueAccountNumber/deposit/history", element: <ProtectedRoute element={<DepositHistory />} /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Provider store={store}>
      <Toaster />
        <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>,
)
