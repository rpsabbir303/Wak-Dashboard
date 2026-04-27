import { createBrowserRouter, Navigate } from 'react-router-dom'
import { GuestOnly, RequireAuth } from '@/app/auth-guards'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { VendorLayout } from '@/components/layout/dashboard-layout'
import { AdminLayout } from '@/components/layout/admin-layout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { VerifyOtpPage } from '@/pages/auth/VerifyOtpPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { AnalyticsPage } from '@/pages/vendor/AnalyticsPage'
import { DashboardPage } from '@/pages/vendor/DashboardPage'
import { DeliveryRequestsPage } from '@/pages/vendor/DeliveryRequestsPage'
import { DriverQueuePage } from '@/pages/driver/DriverQueuePage'
import { MessagesPage } from '@/pages/vendor/MessagesPage'
import { ChatPage } from '@/pages/chat/ChatPage'
import { OrdersListPage } from '@/pages/vendor/OrdersListPage'
import { OrderDetailsPage } from '@/pages/vendor/OrderDetailsPage'
import { CustomerDetailsPage } from '@/pages/vendor/CustomerDetailsPage'
import { CustomersManagementPage } from '@/pages/vendor/CustomersManagementPage'
import { ProductFormPage } from '@/pages/vendor/ProductFormPage'
import { ProductDetailsPage } from '@/pages/vendor/ProductDetailsPage'
import { ProductsListPage } from '@/pages/vendor/ProductsListPage'
import { ServiceCreatePage } from '@/pages/vendor/ServiceCreatePage'
import { ServiceDetailsPage } from '@/pages/vendor/ServiceDetailsPage'
import { ServiceFormPage } from '@/pages/vendor/ServiceFormPage'
import { ServicesListPage } from '@/pages/vendor/ServicesListPage'
import { SettingsPage } from '@/pages/vendor/SettingsPage'
import { ControllerManagement } from '@/pages/vendor/ControllerManagement'
import { RequireRole } from '@/app/role-guard'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminPlaceholderPage } from '@/pages/admin/AdminPlaceholderPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { ServiceOnboardingPage } from '@/pages/onboarding/service/ServiceOnboardingPage'
import { VendorOnboardingPage } from '@/pages/onboarding/vendor/VendorOnboardingPage'
import { EarningsPage } from '@/pages/vendor/EarningsPage'
import { DashboardPage as ServiceDashboardPage } from '@/pages/service/DashboardPage'
import { ServicesPage as ServiceServicesPage } from '@/pages/service/ServicesPage'
import { BookingsPage as ServiceBookingsPage } from '@/pages/service/BookingsPage'
import { EarningsPage as ServiceEarningsPage } from '@/pages/service/EarningsPage'
import { SettingsPage as ServiceSettingsPage } from '@/pages/service/SettingsPage'

export const appRouter = createBrowserRouter([
  {
    path: '/auth',
    element: <GuestOnly />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'verify-otp', element: <VerifyOtpPage /> },
          { path: 'reset-password', element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      { path: 'onboarding/service', element: <ServiceOnboardingPage /> },
      { path: 'onboarding/vendor', element: <VendorOnboardingPage /> },
      {
        element: <VendorLayout />,
        children: [
          { index: true, element: <Navigate to="vendor/dashboard" replace /> },
          {
            path: 'vendor',
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'products', element: <ProductsListPage /> },
              { path: 'products/create', element: <ProductFormPage mode="create" /> },
              { path: 'products/edit/:id', element: <ProductFormPage mode="edit" /> },
              { path: 'products/:id/edit', element: <ProductFormPage mode="edit" /> },
              { path: 'products/:id', element: <ProductDetailsPage /> },
              { path: 'services', element: <ServicesListPage /> },
              { path: 'services/create', element: <ServiceCreatePage /> },
              { path: 'services/edit/:id', element: <ServiceFormPage mode="edit" /> },
              { path: 'services/:id', element: <ServiceDetailsPage /> },
              { path: 'orders', element: <OrdersListPage /> },
              { path: 'orders/:id', element: <OrderDetailsPage /> },
              { path: 'customers', element: <CustomersManagementPage /> },
              { path: 'customers/:id', element: <CustomerDetailsPage /> },
              { path: 'delivery-requests', element: <DeliveryRequestsPage /> },
              { path: 'earnings', element: <EarningsPage /> },
              { path: 'messages', element: <MessagesPage /> },
              { path: 'chat/:conversationId', element: <ChatPage /> },
              { path: 'analytics', element: <AnalyticsPage /> },
              { path: 'controllers', element: <ControllerManagement /> },
              { path: 'settings', element: <SettingsPage /> },
              { path: 'settings/profile', element: <SettingsPage /> },
              { path: 'settings/security', element: <SettingsPage /> },
              { path: 'settings/legal', element: <SettingsPage /> },
              { path: 'settings/support', element: <SettingsPage /> },
            ],
          },
          {
            path: 'service',
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <ServiceDashboardPage /> },
              { path: 'services', element: <ServiceServicesPage /> },
              { path: 'bookings', element: <ServiceBookingsPage /> },
              { path: 'earnings', element: <ServiceEarningsPage /> },
              { path: 'messages', element: <MessagesPage /> },
              { path: 'settings', element: <ServiceSettingsPage /> },
              { path: 'settings/profile', element: <ServiceSettingsPage /> },
              { path: 'settings/security', element: <ServiceSettingsPage /> },
              { path: 'settings/legal', element: <ServiceSettingsPage /> },
              { path: 'settings/support', element: <ServiceSettingsPage /> },
            ],
          },
          { path: 'driver/queue', element: <DriverQueuePage /> },
        ],
      },
      {
        element: <RequireRole role="admin" />,
        children: [
          {
            path: 'admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: 'dashboard', element: <AdminDashboardPage /> },
              { path: 'users', element: <AdminUsersPage /> },
              { path: 'orders', element: <AdminPlaceholderPage title="Admin · Orders" /> },
              { path: 'services', element: <AdminPlaceholderPage title="Admin · Services" /> },
              { path: 'products', element: <AdminPlaceholderPage title="Admin · Products" /> },
              { path: 'deliveries', element: <AdminPlaceholderPage title="Admin · Deliveries" /> },
              { path: 'analytics', element: <AdminPlaceholderPage title="Admin · Analytics" /> },
              { path: 'settings', element: <AdminPlaceholderPage title="Admin · Settings" /> },
            ],
          },
        ],
      },
    ],
  },
])
