import { createBrowserRouter, Navigate } from 'react-router-dom'
import { GuestOnly, RequireAuth } from '@/app/auth-guards'
import { AuthLayout } from '@/features/auth'
import { VendorLayout } from '@/shared/components/layout/DashboardLayout'
import { ServiceLayout } from '@/shared/components/layout/ServiceLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { VerifyOtpPage } from '@/features/auth/pages/VerifyOtpPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { AnalyticsPage } from '@/features/dashboard/pages/vendor/AnalyticsPage'
import { DashboardPage } from '@/features/dashboard/pages/vendor/DashboardPage'
import { DeliveryRequestsPage } from '@/features/delivery/pages/DeliveryRequestsPage'
import { DriverQueuePage } from '@/features/delivery/pages/DriverQueuePage'
import { MessagesPage } from '@/features/chat/pages/MessagesPage'
import { ChatPage } from '@/features/chat/pages/ChatPage'
import { OrdersListPage } from '@/features/orders/pages/OrdersListPage'
import { OrderDetailsPage } from '@/features/orders/pages/OrderDetailsPage'
import { CustomerDetailsPage } from '@/features/customers/pages/vendor/CustomerDetailsPage'
import { CustomersManagementPage } from '@/features/customers/pages/vendor/CustomersManagementPage'
import { ProductFormPage } from '@/features/products/pages/ProductFormPage'
import { ProductDetailsPage } from '@/features/products/pages/ProductDetailsPage'
import { ProductsListPage } from '@/features/products/pages/ProductsListPage'
import { ServiceCreatePage } from '@/features/services/pages/vendor/ServiceCreatePage'
import { ServiceDetailsPage } from '@/features/services/pages/vendor/ServiceDetailsPage'
import { ServiceFormPage } from '@/features/services/pages/vendor/ServiceFormPage'
import { ServicesListPage } from '@/features/services/pages/vendor/ServicesListPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { ControllerManagement } from '@/features/settings/pages/ControllerManagement'
import { RequireRole } from '@/app/role-guard'
import { ServiceOnboardingPage } from '@/features/auth/pages/onboarding/service/ServiceOnboardingPage'
import { VendorOnboardingPage } from '@/features/auth/pages/onboarding/vendor/VendorOnboardingPage'
import { EarningsPage } from '@/features/dashboard/pages/vendor/EarningsPage'
import { DashboardPage as ServiceDashboardPage } from '@/features/dashboard/pages/service/DashboardPage'
import { ServicesPage as ServiceServicesPage } from '@/features/services/pages/service/ServicesPage'
import { BookingsPage as ServiceBookingsPage } from '@/features/orders/pages/BookingsPage'
import { EarningsPage as ServiceEarningsPage } from '@/features/dashboard/pages/service/EarningsPage'
import { SettingsPage as ServiceSettingsPage } from '@/features/settings/pages/ServiceSettingsPage'
import { AddServicePage } from '@/features/services/pages/service/AddServicePage'
import { ServiceDetails } from '@/features/services/pages/service/ServiceDetails'
import { AnalyticsPage as ServiceAnalyticsPage } from '@/features/dashboard/pages/service/AnalyticsPage'
import { CustomersManagementPage as ServiceCustomersManagementPage } from '@/features/customers/pages/service/CustomersManagementPage'
import { CustomerDetailsPage as ServiceCustomerDetailsPage } from '@/features/customers/pages/service/CustomerDetailsPage'
import { ControllerManagementPage as ServiceControllerManagementPage } from '@/features/settings/pages/ControllerManagementPage'
import { RequireServicePermission } from '@/app/RequireServicePermission'
import { MessagesPage as ServiceMessagesPage } from '@/features/chat/pages/ServiceMessagesPage'

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
