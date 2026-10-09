import clsx from 'clsx';
import { Check } from 'lucide-react';
import type { DeliveryMethod, Order, OrderStatus } from '../../types';

type Step = { status: OrderStatus; label: string };

const PLACED: Step = { status: 'pending', label: 'Order placed' };
const PAID: Step = { status: 'paid', label: 'Payment confirmed' };
const PREPARING: Step = { status: 'processing', label: 'Being prepared' };

const STEPS: Record<DeliveryMethod | '', Step[]> = {
  pickup: [PLACED, PAID, PREPARING, { status: 'ready_for_pickup', label: 'Ready for pickup' }, { status: 'delivered', label: 'Collected' }],
  rider: [PLACED, PAID, PREPARING, { status: 'out_for_delivery', label: 'Out for delivery' }, { status: 'delivered', label: 'Delivered' }],
  agent: [PLACED, PAID, PREPARING, { status: 'shipped', label: 'At your pickup agent' }, { status: 'delivered', label: 'Collected' }],
  '': [PLACED, PAID, PREPARING, { status: 'shipped', label: 'Shipped' }, { status: 'delivered', label: 'Delivered' }],
};

const timeFormat = new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeStyle: 'short' });

export function OrderTimeline({ order }: { order: Order }) {
  const steps = STEPS[order.delivery_method];
  const currentIndex = steps.findIndex((step) => step.status === order.status);
  // Staff may skip a step (e.g. straight from paid to out for delivery); earlier steps still count as done.
  const reachedAt = (status: OrderStatus) =>
    order.status_events.find((event) => event.status === status)?.created_at;

  return (
    <ol className="flex flex-col">
      {steps.map((step, index) => {
        const done = index <= currentIndex;
        const time = reachedAt(step.status);
        const isLast = index === steps.length - 1;
        return (
          <li key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={clsx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                  done ? 'border-sage-600 bg-sage-600 text-cream-50' : 'border-cream-300 bg-cream-50',
                  index === currentIndex && 'ring-4 ring-sage-100',
                )}
              >
                {done && <Check size={13} strokeWidth={3} />}
              </span>
              {!isLast && <span className={clsx('w-0.5 flex-1', index < currentIndex ? 'bg-sage-600' : 'bg-cream-300')} />}
            </div>
            <div className={clsx('pb-5', isLast && 'pb-0')}>
              <p className={clsx('text-sm font-semibold', done ? 'text-sage-900' : 'text-ink-600/70')}>{step.label}</p>
              {done && time && <p className="text-xs text-ink-600">{timeFormat.format(new Date(time))}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
