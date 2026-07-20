import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, PackageSearch, XCircle } from 'lucide-react';
import { useOrder } from '../hooks/useOrders';
import { useVerifyPayment } from '../hooks/usePayments';
import { PageSpinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { formatDate, formatPrice } from '../lib/format';
import type { OrderStatus } from '../types';

const STATUS_META: Record<OrderStatus, { label: string; tone: string; icon: typeof Clock }> = {
  pending: { label: 'Awaiting payment', tone: 'text-gold-600 bg-gold-300/40', icon: Clock },
  paid: { label: 'Paid', tone: 'text-sage-700 bg-sage-100', icon: CheckCircle2 },
  processing: { label: 'Processing', tone: 'text-sage-700 bg-sage-100', icon: PackageSearch },
  shipped: { label: 'Shipped', tone: 'text-sage-700 bg-sage-100', icon: PackageSearch },
  delivered: { label: 'Delivered', tone: 'text-sage-700 bg-sage-100', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', tone: 'text-rose-700 bg-rose-300/40', icon: XCircle },
  refunded: { label: 'Refunded', tone: 'text-rose-700 bg-rose-300/40', icon: XCircle },
};

export function OrderDetail() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [params] = useSearchParams();
  const reference = params.get('reference') || params.get('trxref');
  const { data: order, isLoading, refetch } = useOrder(orderNumber);
  const verifyPayment = useVerifyPayment();
  const [verifying, setVerifying] = useState(Boolean(reference));
  const attempted = useRef(false);

  useEffect(() => {
    if (reference && !attempted.current) {
      attempted.current = true;
      verifyPayment.mutate(reference, {
        onSettled: async () => {
          await refetch();
          setVerifying(false);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (isLoading || verifying) return <PageSpinner />;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-sage-900">Order not found</h1>
        <Link to="/account/orders" className="mt-4 inline-block text-sage-700 underline">
          View your orders
        </Link>
      </div>
    );
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
                <img src={item.product_image} alt="" className="h-14 w-14 rounded-xl object-cover" />
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

        <div className="mt-6 border-t border-cream-300 pt-6 text-sm text-ink-700">
          <p className="font-semibold text-sage-900">Shipping to</p>
          <p>{order.full_name}</p>
          <p>{order.shipping_address_text}</p>
          <p>{order.phone_number}</p>
        </div>

        {order.status === 'pending' && (
          <p className="mt-6 rounded-xl bg-gold-300/30 p-3 text-center text-sm text-ink-700">
            Payment hasn't been confirmed yet. If you completed payment, refresh this page in a moment.
          </p>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link to="/shop">
            <Button variant="outline">Continue shopping</Button>
          </Link>
          <Link to="/account/orders">
            <Button>View all orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
