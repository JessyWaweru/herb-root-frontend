import { createBrowserRouter, Outlet, ScrollRestoration } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { Home } from '../pages/Home';
import { Shop } from '../pages/Shop';
import { ShopByConcern } from '../pages/ShopByConcern';
import { ProductDetail } from '../pages/ProductDetail';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderDetail } from '../pages/OrderDetail';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { NotFound } from '../pages/NotFound';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { RevertEmail } from '../pages/auth/RevertEmail';
import { AccountLayout } from '../pages/account/AccountLayout';
import { AccountProfile } from '../pages/account/AccountProfile';
import { AccountAddresses } from '../pages/account/AccountAddresses';
import { AccountOrders } from '../pages/account/AccountOrders';
import { AccountWishlist } from '../pages/account/AccountWishlist';
import { AccountConsultations } from '../pages/account/AccountConsultations';
import { Experts } from '../pages/experts/Experts';
import { ExpertDetail } from '../pages/experts/ExpertDetail';
import { ConsultationDetail } from '../pages/experts/ConsultationDetail';

function Root() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/shop', element: <Shop /> },
          { path: '/concerns', element: <ShopByConcern /> },
          { path: '/shop/:slug', element: <ProductDetail /> },
          { path: '/cart', element: <Cart /> },
          { path: '/about', element: <About /> },
          { path: '/contact', element: <Contact /> },
          { path: '/experts', element: <Experts /> },
          { path: '/experts/:slug', element: <ExpertDetail /> },
          {
            element: <ProtectedRoute />,
            children: [
              { path: '/checkout', element: <Checkout /> },
              { path: '/orders/:orderNumber', element: <OrderDetail /> },
              { path: '/consultations/:reference', element: <ConsultationDetail /> },
              {
                path: '/account',
                element: <AccountLayout />,
                children: [
                  { index: true, element: <AccountProfile /> },
                  { path: 'addresses', element: <AccountAddresses /> },
                  { path: 'orders', element: <AccountOrders /> },
                  { path: 'wishlist', element: <AccountWishlist /> },
                  { path: 'consultations', element: <AccountConsultations /> },
                ],
              },
            ],
          },
          { path: '*', element: <NotFound /> },
        ],
      },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password/:uid/:token', element: <ResetPassword /> },
      { path: '/revert-email', element: <RevertEmail /> },
    ],
  },
]);
