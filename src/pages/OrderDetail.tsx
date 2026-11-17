import { useParams, useSearchParams } from 'react-router-dom';
import { Bike, CheckCircle2, Clock, PackageSearch, Store, XCircle } from 'lucide-react';
import { useOrder } from '../hooks/useOrders';
import { usePaymentConfirmation } from '../hooks/usePayments';
import { PendingPayment } from '../components/payment/PendingPayment';
import { PageSpinner } from '../components/ui/Spinner';
import { ButtonLink } from '../components/ui/Button';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { formatDate, formatPrice } from '../lib/format';
import { ProductImage } from '../components/product/ProductImage';
import { Sprig } from '../components/art/Botanical';
import type { OrderStatus } from '../types';
import { ItemNotFound } from '../components/ui/ItemNotFound';

const STATUS_META: Record<OrderStatus, { label: string; tone: string; icon: typeof Clock }> = {
  pending: { label: 'Awaiting payment', tone: 'text-gold-700 bg-gold-200', icon: Clock },
  paid: { label: 'Paid', tone: 'text-sage-700 bg-sage-100', icon: CheckCircle2 },
  processing: { label: 'Being prepared', tone: 'text-sage-700 bg-sage-100', icon: PackageSearch },
  ready_for_pickup: { label: 'Ready for pickup', tone: 'text-sage-700 bg-sage-100', icon: Store },
  out_for_delivery: { label: 'Out for delivery', tone: 'text-sage-700 bg-sage-100', icon: Bike },
  shipped: { label: 'At your pickup agent', tone: 'text-sage-700 bg-sage-100', icon: PackageSearch },
  delivered: { label: 'Delivered', tone: 'text-sage-700 bg-sage-100', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', tone: 'text-rose-700 bg-rose-100', icon: XCircle },
  refunded: { label: 'Refunded', tone: 'text-rose-700 bg-rose-100', icon: XCircle },
};

export function OrderDetail() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [params] = useSearchParams();
  const reference = params.get('reference') || params.get('trxref');
  const { data: order, isLoading, refetch } = useOrder(orderNumber);
  const payment = usePaymentConfirmation(reference, params.get('via') === 'mpesa', refetch);

  if (isLoading || payment.checking) return <PageSpinner />;

  if (!order) {
    return <ItemNotFound title="Order not found" linkTo="/account/orders" linkLabel="View your orders" />;
  }

  const status = STATUS_META[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="card animate-rise overflow-hidden">
        <div className="bg-botanical relative flex flex-col items-center overflow-hidden border-b border-cream-300 px-6 py-10 text-center">
          <Sprig className="pointer-events-none absolute -left-6 -top-4 h-48 -rotate-[20deg] text-sage-300/60" />
          <Sprig className="pointer-events-none absolute -right-6 bottom-[-2rem] h-48 rotate-[160deg] text-gold-400/50" />
          <span className={`relative flex h-16 w-16 items-center justify-center rounded-full ring-8 ring-cream-50/70 ${status.tone}`}>
            <StatusIcon size={28} aria-hidden="true" />
          </span>
          <h1 className="relative mt-5 text-balance font-display text-3xl leading-tight text-sage-900 sm:text-4xl">
            {order.status === 'paid' ? 'Thank you for your order!' : status.label}
          </h1>
          <p className="relative mt-2 text-sm text-ink-600">
            Order <span className="font-semibold text-sage-900">#{order.order_number}</span> · {formatDate(order.created_at)}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <ul className="flex flex-col gap-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                {item.product_image && (
                  <ProductImage src={item.product_image} seed={item.product_slug ?? item.id} className="h-16 w-16 shrink-0 rounded-2xl" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg leading-tight text-sage-900">{item.product_name}</p>
                  <p className="mt-0.5 text-xs text-ink-600">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-ink-800">{formatPrice(item.line_total, order.currency)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-cream-300 pt-6 text-sm text-ink-700">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(order.subtotal, order.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{formatPrice(order.shipping_fee, order.currency)}</dd>
            </div>
            <div className="flex items-baseline justify-between pt-2 font-display text-sage-900">
              <dt className="text-lg">Total</dt>
              <dd className="text-3xl">{formatPrice(order.total_amount, order.currency)}</dd>
            </div>
          </dl>

          {order.status !== 'cancelled' && order.status !== 'refunded' && (
            <div className="mt-6 border-t border-cream-300 pt-6">
              <p className="eyebrow mb-5 text-sage-700">Order progress</p>
              <OrderTimeline order={order} />
            </div>
          )}

          <div className="mt-6 border-t border-cream-300 pt-6 text-sm leading-relaxed text-ink-700">
            <p className="eyebrow mb-3 text-sage-700">{order.delivery_option_name || 'Shipping to'}</p>
            <p className="font-semibold text-sage-900">
              {order.full_name} · {order.phone_number}
            </p>
            <p>{order.shipping_address_text}</p>
            {order.rider && (
              <p className="mt-3 rounded-2xl bg-sage-50 p-3.5 ring-1 ring-sage-100">
                Your rider is <span className="font-semibold text-sage-900">{order.rider.name}</span>,{' '}
                <a href={`tel:${order.rider.phone_number}`} className="font-semibold text-sage-700 underline underline-offset-2">
                  {order.rider.phone_number}
                </a>
                .
              </p>
            )}
            {order.tracking_code && (
              <p className="mt-3">
                Parcel code:{' '}
                <span className="rounded-lg bg-cream-200 px-2 py-1 font-semibold tracking-wider text-sage-900">{order.tracking_code}</span>
              </p>
            )}
          </div>

          {order.status === 'pending' && (
            <PendingPayment
              target={{ order_number: order.order_number }}
              returnPath={`/orders/${order.order_number}`}
              amount={order.total_amount}
              currency={order.currency}
              defaultPhone={order.phone_number}
              waitingForPin={payment.waitingForPin}
              failed={payment.failed}
            />
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/shop" variant="outline">
              Continue shopping
            </ButtonLink>
            <ButtonLink to="/account/orders">View all orders</ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
