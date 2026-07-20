import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatPrice } from '../../lib/format';

const STATUS_TONE: Record<string, 'sage' | 'gold' | 'rose'> = {
  pending: 'gold',
  paid: 'sage',
  processing: 'sage',
  shipped: 'sage',
  delivered: 'sage',
  cancelled: 'rose',
  refunded: 'rose',
};

export function AccountOrders() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) return <Spinner />;

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No orders yet"
        description="Once you place an order, you'll be able to track it here."
        action={
          <Link to="/shop">
            <Button>Start shopping</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/orders/${order.order_number}`}
          className="flex flex-col gap-2 rounded-2xl border border-cream-300 bg-cream-50 p-5 transition hover:border-sage-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-sage-900">#{order.order_number}</p>
            <p className="text-sm text-ink-600">{formatDate(order.created_at)} · {order.items.length} item(s)</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge tone={STATUS_TONE[order.status] ?? 'sage'}>{order.status}</Badge>
            <span className="font-semibold text-sage-900">{formatPrice(order.total_amount, order.currency)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
