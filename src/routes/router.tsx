import type { ComponentType } from 'react';
import { createBrowserRouter, Outlet, ScrollRestoration, type RouteObject } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageSeo } from '../components/seo/Seo';
import { PageSpinner } from '../components/ui/Spinner';
import { PAGES, type PageMeta } from '../seo/site';
import { ProtectedRoute } from './ProtectedRoute';
import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';
import { RouteError } from '../pages/RouteError';

function Root() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

/**
 * Loads a page's code only when it's first visited, so the home page doesn't download the
 * checkout, account and map code. Fixed pages get their title and description here; pages
 * about one product or expert set their own once the data arrives.
 */
function lazyPage(load: () => Promise<ComponentType>, meta?: PageMeta): Pick<RouteObject, 'lazy'> {
  return {
    lazy: async () => {
      const Page = await load();
      if (!meta) return { Component: Page };
      return {
        Component: function PageWithSeo() {
          return (
            <>
              <PageSeo page={meta} />
              <Page />
            </>
          );
        },
      };
    },
  };
}

function HomePage() {
  return (
    <>
      <PageSeo page={PAGES.home} />
      <Home />
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <PageSeo page={PAGES.notFound} />
      <NotFound />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <RouteError />,
    // Shown only while the first page's code downloads.
    hydrateFallbackElement: (
      <div className="min-h-screen bg-cream-100">
        <PageSpinner />
      </div>
    ),
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/shop', ...lazyPage(() => import('../pages/Shop').then((m) => m.Shop)) },
          { path: '/concerns', ...lazyPage(() => import('../pages/ShopByConcern').then((m) => m.ShopByConcern), PAGES.concerns) },
          { path: '/concerns/:slug', ...lazyPage(() => import('../pages/ConcernDetail').then((m) => m.ConcernDetail)) },
          { path: '/shop/:slug', ...lazyPage(() => import('../pages/ProductDetail').then((m) => m.ProductDetail)) },
          { path: '/cart', ...lazyPage(() => import('../pages/Cart').then((m) => m.Cart), PAGES.cart) },
          { path: '/about', ...lazyPage(() => import('../pages/About').then((m) => m.About), PAGES.about) },
          { path: '/contact', ...lazyPage(() => import('../pages/Contact').then((m) => m.Contact), PAGES.contact) },
          { path: '/privacy', ...lazyPage(() => import('../pages/legal/Privacy').then((m) => m.Privacy), PAGES.privacy) },
          { path: '/terms', ...lazyPage(() => import('../pages/legal/Terms').then((m) => m.Terms), PAGES.terms) },
          { path: '/cookies', ...lazyPage(() => import('../pages/legal/Cookies').then((m) => m.Cookies), PAGES.cookies) },
          { path: '/refunds', ...lazyPage(() => import('../pages/legal/Refunds').then((m) => m.Refunds), PAGES.refunds) },
          { path: '/experts', ...lazyPage(() => import('../pages/experts/Experts').then((m) => m.Experts), PAGES.experts) },
          { path: '/experts/:slug', ...lazyPage(() => import('../pages/experts/ExpertDetail').then((m) => m.ExpertDetail)) },
          {
            element: <ProtectedRoute />,
            children: [
              { path: '/checkout', ...lazyPage(() => import('../pages/Checkout').then((m) => m.Checkout), PAGES.checkout) },
              { path: '/orders/:orderNumber', ...lazyPage(() => import('../pages/OrderDetail').then((m) => m.OrderDetail), PAGES.order) },
              {
                path: '/consultations/:reference',
                ...lazyPage(() => import('../pages/experts/ConsultationDetail').then((m) => m.ConsultationDetail), PAGES.consultation),
              },
              {
                path: '/account',
                ...lazyPage(() => import('../pages/account/AccountLayout').then((m) => m.AccountLayout)),
                children: [
                  { index: true, ...lazyPage(() => import('../pages/account/AccountProfile').then((m) => m.AccountProfile), PAGES.account) },
                  { path: 'addresses', ...lazyPage(() => import('../pages/account/AccountAddresses').then((m) => m.AccountAddresses), PAGES.addresses) },
                  { path: 'orders', ...lazyPage(() => import('../pages/account/AccountOrders').then((m) => m.AccountOrders), PAGES.orders) },
                  { path: 'wishlist', ...lazyPage(() => import('../pages/account/AccountWishlist').then((m) => m.AccountWishlist), PAGES.wishlist) },
                  {
                    path: 'consultations',
                    ...lazyPage(() => import('../pages/account/AccountConsultations').then((m) => m.AccountConsultations), PAGES.consultations),
                  },
                ],
              },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      { path: '/login', ...lazyPage(() => import('../pages/auth/Login').then((m) => m.Login), PAGES.login) },
      { path: '/register', ...lazyPage(() => import('../pages/auth/Register').then((m) => m.Register), PAGES.register) },
      { path: '/forgot-password', ...lazyPage(() => import('../pages/auth/ForgotPassword').then((m) => m.ForgotPassword), PAGES.forgotPassword) },
      {
        path: '/reset-password/:uid/:token',
        ...lazyPage(() => import('../pages/auth/ResetPassword').then((m) => m.ResetPassword), PAGES.resetPassword),
      },
      { path: '/revert-email', ...lazyPage(() => import('../pages/auth/RevertEmail').then((m) => m.RevertEmail), PAGES.revertEmail) },
      {
        path: '/newsletter/unsubscribe',
        ...lazyPage(() => import('../pages/NewsletterUnsubscribe').then((m) => m.NewsletterUnsubscribe), PAGES.unsubscribe),
      },
      { path: '/r/:token', ...lazyPage(() => import('../pages/RiderDelivery').then((m) => m.RiderDelivery), PAGES.rider) },
    ],
  },
]);
