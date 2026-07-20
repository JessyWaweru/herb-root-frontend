import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { Home } from '../pages/Home';
import { Shop } from '../pages/Shop';
import { ProductDetail } from '../pages/ProductDetail';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderDetail } from '../pages/OrderDetail';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { NotFound } from '../pages/NotFound';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { VerifyEmail } from '../pages/auth/VerifyEmail';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { AccountLayout } from '../pages/account/AccountLayout';
import { AccountProfile } from '../pages/account/AccountProfile';
import { AccountAddresses } from '../pages/account/AccountAddresses';
import { AccountOrders } from '../pages/account/AccountOrders';
import { AccountWishlist } from '../pages/account/AccountWishlist';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/shop/:slug', element: <ProductDetail /> },
      { path: '/cart', element: <Cart /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/checkout', element: <Checkout /> },
          { path: '/orders/:orderNumber', element: <OrderDetail /> },
          {
            path: '/account',
            element: <AccountLayout />,
            children: [
              { index: true, element: <AccountProfile /> },
              { path: 'addresses', element: <AccountAddresses /> },
              { path: 'orders', element: <AccountOrders /> },
              { path: 'wishlist', element: <AccountWishlist /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/verify-email/:uid/:token', element: <VerifyEmail /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password/:uid/:token', element: <ResetPassword /> },
]);
