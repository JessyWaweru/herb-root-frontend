import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Bike, CheckCircle2, MapPin, Store } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAddresses } from '../hooks/useAddresses';
import { useCheckout } from '../hooks/useOrders';
import { useInitializePayment } from '../hooks/usePayments';
import { useDeliveryOptions, useDeliveryQuote } from '../hooks/useDelivery';
import { useAuthStore } from '../stores/authStore';
import { PageSpinner, Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import type { Pin } from '../components/checkout/LocationPicker';
import { formatPrice } from '../lib/format';
import { apiErrorMessage } from '../lib/api';
import type { Place } from '../lib/geocoding';
import type { CheckoutPayload } from '../lib/orders';
import type { Address, DeliveryMethod, DeliveryOption } from '../types';

// Leaflet is only needed for rider delivery, so it loads on demand.
const LocationPicker = lazy(() => import('../components/checkout/LocationPicker'));

const checkoutSchema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  phone_number: z.string().min(9, 'Enter a phone number we can call'),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  county_or_state: z.string().optional(),
  landmark: z.string().optional(),
  pickup_agent: z.string().optional(),
  customer_notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const METHOD_META: Record<DeliveryMethod, { title: string; icon: typeof Store }> = {
  pickup: { title: 'Pick up in town', icon: Store },
  rider: { title: 'Rider delivery (Nairobi)', icon: Bike },
  agent: { title: 'Pickup agent near you', icon: MapPin },
};

const METHODS: DeliveryMethod[] = ['pickup', 'rider', 'agent'];

function lowestFee(options: DeliveryOption[]) {
  return Math.min(...options.map((o) => parseFloat(o.fee)));
}

export function Checkout() {
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const { data: deliveryOptions, isLoading: optionsLoading } = useDeliveryOptions();
  const user = useAuthStore((s) => s.user);
  const [method, setMethod] = useState<DeliveryMethod | null>(null);
  const [pin, setPin] = useState<Pin | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const quote = useDeliveryQuote(method === 'rider' ? pin : null);
  const checkoutMutation = useCheckout();
  const initializePayment = useInitializePayment();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name: [user?.first_name, user?.last_name].filter(Boolean).join(' '),
      phone_number: user?.phone_number ?? '',
    },
  });

  if (cartLoading || addressesLoading || optionsLoading) return <PageSpinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EmptyState icon="🧺" title="Your basket is empty" description="Add a few remedies before checking out." />
      </div>
    );
  }

  const optionsByMethod = (m: DeliveryMethod) => (deliveryOptions ?? []).filter((o) => o.method === m);
  const availableMethods = METHODS.filter((m) => optionsByMethod(m).length > 0);
  const singleOption = method && method !== 'rider' ? optionsByMethod(method)[0] : undefined;

  // The fee shown here is a preview; the server recalculates it when the order is placed.
  const riderZone = method === 'rider' && quote.data?.available ? quote.data.option : null;
  const riderOutOfArea = method === 'rider' && quote.data && !quote.data.available;
  const deliveryFee = singleOption ? parseFloat(singleOption.fee) : riderZone ? parseFloat(riderZone.fee) : null;
  const subtotal = parseFloat(cart.subtotal);

  const applySavedAddress = (address: Address) => {
    setSelectedAddressId(address.id);
    setValue('full_name', address.full_name);
    setValue('phone_number', address.phone_number);
    setValue('address_line1', address.address_line1);
    setValue('address_line2', address.address_line2);
    setValue('city', address.city);
    setValue('county_or_state', address.county_or_state);
    setValue('landmark', address.landmark);
    setPin(address.latitude && address.longitude ? { latitude: parseFloat(address.latitude), longitude: parseFloat(address.longitude) } : null);
  };

  // Prefill empty address fields from the pin, without overwriting what the customer typed.
  const fillFromPlace = (place: Place) => {
    const fill = (field: 'address_line1' | 'address_line2' | 'city' | 'county_or_state', value: string) => {
      if (value && !getValues(field)) setValue(field, value);
    };
    fill('address_line1', place.road);
    fill('address_line2', place.area);
    fill('city', place.city);
    fill('county_or_state', place.county);
  };

  const placeOrder = async (values: CheckoutForm) => {
    if (!method) return;
    if (method === 'rider') {
      if (!pin) return toast.error('Drop a pin on the map so our rider can find you.');
      if (!values.address_line1) return setError('address_line1', { message: 'Enter your street, building or house' });
      if (!values.city) return setError('city', { message: 'Enter your area or town' });
    }
    if (method === 'agent' && !values.pickup_agent?.trim()) {
      return setError('pickup_agent', { message: 'Tell us which agent you’ll collect from' });
    }

    const payload: CheckoutPayload = {
      delivery_method: method,
      delivery_option_id: singleOption?.id,
      full_name: values.full_name,
      phone_number: values.phone_number,
      customer_notes: values.customer_notes,
      ...(method === 'rider' && pin
        ? {
            address_line1: values.address_line1,
            address_line2: values.address_line2,
            city: values.city,
            county_or_state: values.county_or_state,
            landmark: values.landmark,
            latitude: pin.latitude.toFixed(6),
            longitude: pin.longitude.toFixed(6),
          }
        : {}),
      ...(method === 'agent' ? { pickup_agent: values.pickup_agent } : {}),
    };

    try {
      const order = await checkoutMutation.mutateAsync(payload);
      const payment = await initializePayment.mutateAsync(order.order_number);
      window.location.href = payment.authorization_url;
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not place your order.'));
    }
  };

  const isPlacing = checkoutMutation.isPending || initializePayment.isPending;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-sage-900">Checkout</h1>

      <form onSubmit={handleSubmit(placeOrder)} className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="font-display text-lg text-sage-900">1. How would you like to get your order?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {availableMethods.map((m) => {
                const { title, icon: Icon } = METHOD_META[m];
                const options = optionsByMethod(m);
                const fee = lowestFee(options);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={clsx(
                      'flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition',
                      method === m ? 'border-sage-500 bg-sage-50 ring-1 ring-sage-500' : 'border-cream-300 bg-cream-50 hover:border-sage-300',
                    )}
                  >
                    <Icon size={20} className="text-sage-700" />
                    <span className="mt-1 text-sm font-semibold text-sage-900">{title}</span>
                    <span className="text-xs text-ink-600">{options[0].eta}</span>
                    <span className="mt-1 text-sm font-semibold text-ink-800">
                      {options.length > 1 ? 'from ' : ''}
                      {formatPrice(fee)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {method && (
            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg text-sage-900">2. Your details</h2>

              {method === 'pickup' && singleOption && (
                <div className="rounded-2xl bg-sage-50 p-4 text-sm text-ink-700">
                  <p className="font-semibold text-sage-900">{singleOption.name}</p>
                  <p>{singleOption.address}</p>
                  <p className="mt-1 text-xs text-ink-600">{singleOption.description}</p>
                </div>
              )}

              {method === 'rider' && (
                <>
                  {addresses && addresses.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {addresses.map((address) => (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => applySavedAddress(address)}
                          className={clsx(
                            'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                            selectedAddressId === address.id
                              ? 'border-sage-500 bg-sage-50 text-sage-800'
                              : 'border-cream-300 text-ink-700 hover:border-sage-300',
                          )}
                        >
                          {address.label}: {address.address_line1}
                        </button>
                      ))}
                    </div>
                  )}
                  <Suspense fallback={<Spinner />}>
                    <LocationPicker value={pin} onChange={setPin} onPlaceFound={fillFromPlace} />
                  </Suspense>
                  {quote.data && (
                    <p
                      className={clsx(
                        'rounded-xl p-3 text-sm',
                        riderZone ? 'bg-sage-50 text-sage-800' : 'bg-gold-300/30 text-ink-700',
                      )}
                    >
                      {riderZone
                        ? `${riderZone.name} · about ${quote.data.distance_km} km from town · ${formatPrice(riderZone.fee)}`
                        : 'That pin is outside our rider area. Choose “Pickup agent near you” to collect from an agent instead.'}
                    </p>
                  )}
                  <Input
                    label="Street, building or house"
                    {...register('address_line1')}
                    error={errors.address_line1?.message}
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input label="Estate / area" {...register('address_line2')} />
                    <Input label="Town" {...register('city')} error={errors.city?.message} />
                    <Input label="County" {...register('county_or_state')} />
                  </div>
                  <Input
                    label="Directions for the rider"
                    placeholder="e.g. Blue gate opposite Naivas, 3rd floor"
                    {...register('landmark')}
                  />
                </>
              )}

              {method === 'agent' && singleOption && (
                <>
                  <p className="rounded-2xl bg-sage-50 p-4 text-sm text-ink-700">{singleOption.description}</p>
                  <Input
                    label="Which agent will you collect from?"
                    placeholder="e.g. Kisumu — Mega Plaza"
                    {...register('pickup_agent')}
                    error={errors.pickup_agent?.message}
                  />
                  <p className="-mt-2 text-xs text-ink-600">
                    You'll get an SMS with a collection code when your parcel arrives at the agent.
                  </p>
                </>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" {...register('full_name')} error={errors.full_name?.message} />
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="07xx xxx xxx"
                  {...register('phone_number')}
                  error={errors.phone_number?.message}
                />
              </div>
              <Textarea label="Order notes (optional)" rows={3} {...register('customer_notes')} />
            </section>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-cream-300 bg-cream-50 p-6 lg:sticky lg:top-24">
          <h3 className="font-display text-lg text-sage-900">Order summary</h3>
          <div className="mt-4 flex flex-col gap-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-ink-700">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.line_total, item.product.currency)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-cream-300 pt-4 text-sm text-ink-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                {deliveryFee !== null
                  ? formatPrice(deliveryFee)
                  : method === 'rider'
                    ? 'Drop a pin'
                    : 'Choose an option'}
              </span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-cream-300 pt-3 font-display text-lg text-sage-900">
            <span>Total</span>
            <span>{formatPrice(subtotal + (deliveryFee ?? 0))}</span>
          </div>
          <Button
            type="submit"
            size="lg"
            isLoading={isPlacing}
            disabled={!method || Boolean(riderOutOfArea) || (method === 'rider' && !riderZone)}
            className="mt-5 w-full"
          >
            Continue to payment
          </Button>
          <div className="mt-4 flex items-start gap-2 text-xs text-ink-600">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-sage-600" />
            You'll be redirected to Paystack to complete payment securely via card or M-Pesa.
          </div>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="mt-4 text-xs font-semibold text-sage-700 underline"
          >
            Edit basket
          </button>
        </div>
      </form>
    </div>
  );
}
