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
import AdminWithdrawal from './pages/admin/dashboard/cashFlows/withdrawals/AdminWithdrawal';
import AdminDeposit from './pages/admin/dashboard/cashFlows/deposits/AdminDeposit';
import AdminWithdrawalAction from './pages/admin/dashboard/cashFlows/withdrawals/AdminWithdrawalAction';
import AdminTransactionAction from './pages/admin/dashboard/transactions/AdminTransactionAction';
import AdminDepositAction from './pages/admin/dashboard/cashFlows/deposits/AdminDepositAction';
import AdminWithdrawalHistory from './pages/admin/dashboard/cashFlows/withdrawals/AdminWithdrawalHistory';
import AdminDepositHistory from './pages/admin/dashboard/cashFlows/deposits/AdminDepositHistory';
import AdminTransactionHistory from './pages/admin/dashboard/transactions/AdminTransactionHistory';
import AdminCashFlowHistory from './pages/admin/dashboard/cashFlows/CashFlowHistory';
import CreateUser from './pages/admin/dashboard/users/CreateUser';
import EditUser from './pages/admin/dashboard/users/EditUser';
import CreateAccount from './pages/admin/dashboard/accounts/CreateAccount';
import UserSetPin from './pages/customer/initialization/UserSetPin';
import UserLogin from './pages/customer/initialization/UserLogin';
import ForgotPin from './pages/customer/resetAndForgotPin/ForgotPin';
import ResetPin from './pages/customer/resetAndForgotPin/ResetPin';
import SearchPage from './pages/admin/dashboard/search/SearchPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [

      {
        path: "search",
        element: <SearchPage/>,
      },
      {
        path: "set-pin/:token",
        element: <UserSetPin/>,
      },
      {
        path: "login",
        element: <UserLogin/>,
      },
      {
        path: "forgot-pin",
        element: <ForgotPin/>,
      },
      {
        path: "reset-pin/:token",
        element: <ResetPin/>,
      },
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
        path: "/users/:userId/edit-user",
        element: <EditUser />,
      },
      {
        path: "/users/:userId/accounts",
        element: <UserAccounts />,
      },
      {
        path: "/users/:userId/accounts/create",
        element: <CreateAccount />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/transaction",
        element: <AdminTransaction />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/cashflow-history",
        element: <AdminCashFlowHistory />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/transaction/action",
        element: <AdminTransactionAction />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/transaction/history",
        element: <AdminTransactionHistory />,
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
        path: "/admin/account/:uniqueAccountNumber/withdrawal/history",
        element: <AdminWithdrawalHistory />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/deposit",
        element: <AdminDeposit />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/deposit/action",
        element: <AdminDepositAction />,
      },
      {
        path: "/admin/account/:uniqueAccountNumber/deposit/history",
        element: <AdminDepositHistory />,
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
        path: 'admin/create-user',
        element: <CreateUser />,
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
