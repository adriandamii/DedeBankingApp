// Inside your main file where you configure the router
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/layout/Layout';
import {AdminCreate} from './pages/admin/initialization/AdminCreate';
import {AdminSendPass} from './pages/admin/initialization/AdminSendPass';
import {AdminLogin} from './pages/admin/initialization/AdminLogin';
import { AdminDashboard } from './pages/admin/dashboard/AdminDashboard';
import { Provider } from 'react-redux';
import { store } from './app/store';
import UsersList from './pages/admin/dashboard/users/UsersList';
import AdminManagement from './pages/admin/dashboard/management/AdminManagement';
import './index.css';
import { UserDetails } from './pages/admin/dashboard/users/UserDetails';
import { UserAccounts } from './pages/admin/dashboard/accounts/UserAccounts';
import AccountDetails from './pages/admin/dashboard/accounts/AccountDetails';
import AdminTransaction from './pages/admin/dashboard/transactions/AdminTransaction';
import AdminWithdrawal from './pages/admin/dashboard/withdrawals/AdminWithdrawal';
import AdminDeposit from './pages/admin/dashboard/deposits/AdminDeposit';
import AdminWithdrawalAction from './pages/admin/dashboard/withdrawals/AdminWithdrawalAction';
import AdminTransactionAction from './pages/admin/dashboard/transactions/AdminTransactionAction';
import AdminDepositAction from './pages/admin/dashboard/deposits/AdminDepositAction';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,  // Layout wraps around all child routes
    children: [
      {
        path: "admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "admin/users",
        element: <UsersList />,
      },
      {
        path: "users/:userId",
        element: <UserDetails />,
      },
      {
        path: "/users/:userId/accounts",
        element: <UserAccounts />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/transaction",
        element: <AdminTransaction />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/transaction/action",
        element: <AdminTransactionAction />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/withdrawal",
        element: <AdminWithdrawal />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/withdrawal/action",
        element: <AdminWithdrawalAction />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/deposit",
        element: <AdminDeposit />,
      },
      {
        path: "/admin/account/:accountId/deposit/action",
        element: <AdminDepositAction />,
      },
      {
        path: "/users/:userId/accounts/:accountId",
        element: <AccountDetails />,
      },
      {
        path: "admin/management",
        element: <AdminManagement />,
      },
      {
        path: "admin/create",
        element: <AdminCreate />,
      },
      {
        path: "admin/send-login-password",
        element: <AdminSendPass />,
      },
      {
        path: "admin/login",
        element: <AdminLogin />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>,
)
