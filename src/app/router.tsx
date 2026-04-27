import { createBrowserRouter, Navigate } from 'react-router-dom'
import { GuestOnly, RequireAuth } from '@/app/auth-guards'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { VendorLayout } from '@/components/layout/dashboard-layout'
import { ServiceLayout } from '@/components/layout/ServiceLayout'
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
import { ServiceOnboardingPage } from '@/pages/onboarding/service/ServiceOnboardingPage'
import { VendorOnboardingPage } from '@/pages/onboarding/vendor/VendorOnboardingPage'
import { EarningsPage } from '@/pages/vendor/EarningsPage'
import { DashboardPage as ServiceDashboardPage } from '@/pages/service/DashboardPage'
import { ServicesPage as ServiceServicesPage } from '@/pages/service/ServicesPage'
import { BookingsPage as ServiceBookingsPage } from '@/pages/service/BookingsPage'
import { EarningsPage as ServiceEarningsPage } from '@/pages/service/EarningsPage'
import { SettingsPage as ServiceSettingsPage } from '@/pages/service/SettingsPage'
import { AddServicePage } from '@/pages/service/AddServicePage'
import { ServiceDetails } from '@/pages/service/ServiceDetails'
import { AnalyticsPage as ServiceAnalyticsPage } from '@/pages/service/AnalyticsPage'
import { CustomersManagementPage as ServiceCustomersManagementPage } from '@/pages/service/CustomersManagementPage'
import { CustomerDetailsPage as ServiceCustomerDetailsPage } from '@/pages/service/CustomerDetailsPage'
import { ControllerManagementPage as ServiceControllerManagementPage } from '@/pages/service/ControllerManagementPage'
import { RequireServicePermission } from '@/app/RequireServicePermission'
import { MessagesPage as ServiceMessagesPage } from '@/pages/service/MessagesPage'

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
      { index: true, element: <Navigate to="/service/dashboard" replace /> },
      { path: 'onboarding/service', element: <ServiceOnboardingPage /> },
      { path: 'onboarding/vendor', element: <VendorOnboardingPage /> },
      {
        element: <VendorLayout />,
        children: [
          {
            element: <RequireRole role="vendor" />,
            children: [
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
            ],
          },
          { path: 'driver/queue', element: <DriverQueuePage /> },
        ],
      },
      {
        element: <ServiceLayout />,
        children: [
          {
            element: <RequireRole role="service" />,
            children: [
              {
                path: 'service',
                children: [
                  { index: true, element: <Navigate to="dashboard" replace /> },
                  { path: 'dashboard', element: <RequireServicePermission permission="dashboard">{<ServiceDashboardPage />}</RequireServicePermission> },
                  { path: 'services', element: <RequireServicePermission permission="services">{<ServiceServicesPage />}</RequireServicePermission> },
                  { path: 'add-service', element: <AddServicePage /> },
                  { path: 'bookings', element: <RequireServicePermission permission="bookings">{<ServiceBookingsPage />}</RequireServicePermission> },
                  { path: 'analytics', element: <RequireServicePermission permission="analytics">{<ServiceAnalyticsPage />}</RequireServicePermission> },
                  { path: 'earnings', element: <RequireServicePermission permission="earnings">{<ServiceEarningsPage />}</RequireServicePermission> },
                  { path: 'customers', element: <RequireServicePermission permission="customers">{<ServiceCustomersManagementPage />}</RequireServicePermission> },
                  { path: 'customer/:id', element: <ServiceCustomerDetailsPage /> },
                  { path: 'controllers', element: <ServiceControllerManagementPage /> },
                  { path: 'messages', element: <RequireServicePermission permission="messages">{<ServiceMessagesPage />}</RequireServicePermission> },
                  { path: 'settings', element: <RequireServicePermission permission="settings"><ServiceSettingsPage /></RequireServicePermission> },
                  { path: 'settings/profile', element: <RequireServicePermission permission="settings"><ServiceSettingsPage /></RequireServicePermission> },
                  { path: 'settings/security', element: <RequireServicePermission permission="settings"><ServiceSettingsPage /></RequireServicePermission> },
                  { path: 'settings/legal', element: <RequireServicePermission permission="settings"><ServiceSettingsPage /></RequireServicePermission> },
                  { path: 'settings/support', element: <RequireServicePermission permission="settings"><ServiceSettingsPage /></RequireServicePermission> },
                  { path: ':id', element: <ServiceDetails /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <div>Page Not Found</div> },
])
