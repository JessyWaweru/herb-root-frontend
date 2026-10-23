import { useParams, useSearchParams } from 'react-router-dom';
import { Bike, CheckCircle2, Clock, PackageSearch, Store, XCircle } from 'lucide-react';
import { useOrder } from '../hooks/useOrders';
import { usePaymentConfirmation } from '../hooks/usePayments';
import { PendingPayment } from '../components/payment/PendingPayment';
import { PageSpinner } from '../components/ui/Spinner';
import { ButtonLink } from '../components/ui/Button';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { formatDate, formatPrice, resolveMediaUrl } from '../lib/format';
import type { OrderStatus } from '../types';
import { ItemNotFound } from '../components/ui/ItemNotFound';

const STATUS_META: Record<OrderStatus, { label: string; tone: string; icon: typeof Clock }> = {
  pending: { label: 'Awaiting payment', tone: 'text-gold-700 bg-gold-300/40', icon: Clock },
  paid: { label: 'Paid', tone: 'text-sage-700 bg-sage-100', icon: CheckCircle2 },
  processing: { label: 'Being prepared', tone: 'text-sage-700 bg-sage-100', icon: PackageSearch },
  ready_for_pickup: { label: 'Ready for pickup', tone: 'text-sage-700 bg-sage-100', icon: Store },
  out_for_delivery: { label: 'Out for delivery', tone: 'text-sage-700 bg-sage-100', icon: Bike },
  shipped: { label: 'At your pickup agent', tone: 'text-sage-700 bg-sage-100', icon: PackageSearch },
  delivered: { label: 'Delivered', tone: 'text-sage-700 bg-sage-100', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', tone: 'text-rose-700 bg-rose-300/40', icon: XCircle },
  refunded: { label: 'Refunded', tone: 'text-rose-700 bg-rose-300/40', icon: XCircle },
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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-cream-300 bg-cream-50 p-8">
        <div className="flex flex-col items-center text-center">
          <span className={`flex h-14 w-14 items-center justify-center rounded-full ${status.tone}`}>
            <StatusIcon size={26} />
          </span>
          <h1 className="mt-4 font-display text-2xl text-sage-900">
            {order.status === 'paid' ? 'Thank you for your order!' : status.label}
          </h1>
          <p className="mt-1 text-sm text-ink-600">Order #{order.order_number} · {formatDate(order.created_at)}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-cream-300 pt-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.product_image && (
                <img src={resolveMediaUrl(item.product_image)} alt="" className="h-14 w-14 rounded-xl object-cover" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-sage-900">{item.product_name}</p>
                <p className="text-xs text-ink-600">Qty {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-ink-800">
                {formatPrice(item.line_total, order.currency)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-1 border-t border-cream-300 pt-6 text-sm text-ink-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal, order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatPrice(order.shipping_fee, order.currency)}</span>
          </div>
          <div className="flex justify-between font-display text-lg text-sage-900">
            <span>Total</span>
            <span>{formatPrice(order.total_amount, order.currency)}</span>
          </div>
        </div>

        {order.status !== 'cancelled' && order.status !== 'refunded' && (
          <div className="mt-6 border-t border-cream-300 pt-6">
            <p className="mb-4 text-sm font-semibold text-sage-900">Order progress</p>
            <OrderTimeline order={order} />
          </div>
        )}

        <div className="mt-6 border-t border-cream-300 pt-6 text-sm text-ink-700">
          <p className="font-semibold text-sage-900">{order.delivery_option_name || 'Shipping to'}</p>
          <p>{order.full_name} · {order.phone_number}</p>
          <p>{order.shipping_address_text}</p>
          {order.rider && (
            <p className="mt-2 rounded-xl bg-sage-50 p-3">
              Your rider is <span className="font-semibold text-sage-900">{order.rider.name}</span>,{' '}
              <a href={`tel:${order.rider.phone_number}`} className="font-semibold text-sage-700 underline">
                {order.rider.phone_number}
              </a>
              .
            </p>
          )}
          {order.tracking_code && (
            <p className="mt-2">
              Parcel code: <span className="font-semibold text-sage-900">{order.tracking_code}</span>
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

        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink to="/shop" variant="outline">Continue shopping</ButtonLink>
          <ButtonLink to="/account/orders">View all orders</ButtonLink>
        </div>
      </div>
    </div>
  );
}
