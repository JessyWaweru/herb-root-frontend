import { lazy, Suspense, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Bike, CheckCircle2, MapPin, ShieldCheck, Store } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAddresses } from '../hooks/useAddresses';
import { useCheckout } from '../hooks/useOrders';
import { usePay, type PaymentChoice } from '../hooks/usePayments';
import { PaymentMethodPicker } from '../components/payment/PaymentMethodPicker';
import { isMpesaNumber } from '../lib/payments';
import { useDeliveryOptions, useDeliveryQuote } from '../hooks/useDelivery';
import { useAddressAutofill } from '../hooks/useAddressAutofill';
import { useAuthStore } from '../stores/authStore';
import { PageSpinner, Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import type { Pin } from '../components/checkout/LocationPicker';
import { formatPrice } from '../lib/format';
import { ProductImage } from '../components/product/ProductImage';
import { Eyebrow } from '../components/ui/SectionHeading';
import { apiErrorMessage } from '../lib/api';
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

/** A numbered step title, as on a paper form. */
function StepHeading({ step, children }: { step: number; children: string }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-2xl leading-tight text-sage-900">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-800 font-sans text-sm font-bold text-cream-50">
        {step}
      </span>
      {children}
    </h2>
  );
}

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
  const pay = usePay();
  const [payChoice, setPayChoice] = useState<PaymentChoice>({ method: 'mpesa', phone: user?.phone_number ?? '' });
  const [phoneError, setPhoneError] = useState<string>();
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

  const autofill = useAddressAutofill(
    (field) => getValues(field),
    (field, value) => setValue(field, value, { shouldValidate: Boolean(value) }),
  );

  if (cartLoading || addressesLoading || optionsLoading) return <PageSpinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EmptyState
          icon="🧺"
          headingLevel={1}
          title="Your basket is empty"
          description="Add a few remedies before checking out."
        />
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
    autofill.forget();
    setValue('full_name', address.full_name);
    setValue('phone_number', address.phone_number);
    setValue('address_line1', address.address_line1);
    setValue('address_line2', address.address_line2);
    setValue('city', address.city);
    setValue('county_or_state', address.county_or_state);
    setValue('landmark', address.landmark);
    setPin(address.latitude && address.longitude ? { latitude: parseFloat(address.latitude), longitude: parseFloat(address.longitude) } : null);
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

    // Checked before placing the order, so a typo doesn't leave an unpaid order behind.
    if (payChoice.method === 'mpesa' && !isMpesaNumber(payChoice.phone)) {
      return setPhoneError('Enter an M-Pesa number like 0712 345 678.');
    }
    setPhoneError(undefined);

    let order;
    try {
      order = await checkoutMutation.mutateAsync(payload);
    } catch (error) {
      return toast.error(apiErrorMessage(error, 'Could not place your order.'));
    }
    const returnPath = `/orders/${order.order_number}`;
    try {
      await pay.mutateAsync({ target: { order_number: order.order_number }, choice: payChoice, returnPath });
    } catch (error) {
      // The order exists now; its page lets the customer pay without ordering twice.
      toast.error(apiErrorMessage(error, 'Your order is saved, but we couldn’t start payment. Try again here.'));
      navigate(returnPath);
    }
  };

  const isPlacing = checkoutMutation.isPending || pay.isPending;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Eyebrow>Secure checkout</Eyebrow>
      <h1 className="mt-4 font-display text-4xl leading-none tracking-[-0.02em] text-sage-900 sm:text-5xl">Checkout</h1>

      <form onSubmit={handleSubmit(placeOrder)} className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div className="flex flex-col gap-6">
          <section className="card p-5 sm:p-7">
            <StepHeading step={1}>How would you like to get your order?</StepHeading>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {availableMethods.map((m) => {
                const { title, icon: Icon } = METHOD_META[m];
                const options = optionsByMethod(m);
                const fee = lowestFee(options);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    aria-pressed={method === m}
                    className={clsx(
                      'relative flex flex-col items-start gap-1 rounded-3xl border p-4 text-left transition duration-200',
                      method === m
                        ? 'border-sage-800 bg-sage-50 shadow-soft ring-1 ring-sage-800'
                        : 'border-cream-300 bg-cream-50 hover:-translate-y-0.5 hover:border-sage-400 hover:shadow-soft',
                    )}
                  >
                    <span
                      className={clsx(
                        'flex h-11 w-11 items-center justify-center rounded-full transition-colors',
                        method === m ? 'bg-sage-800 text-gold-400' : 'bg-sage-100 text-sage-700',
                      )}
                    >
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    {method === m && <CheckCircle2 size={18} className="absolute right-4 top-4 text-sage-700" aria-hidden="true" />}
                    <span className="mt-2 text-sm font-semibold text-sage-900">{title}</span>
                    <span className="text-xs text-ink-600">{options[0].eta}</span>
                    <span className="mt-2 font-display text-lg text-sage-900">
                      {options.length > 1 ? 'from ' : ''}
                      {formatPrice(fee)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {method && (
            <section className="card flex animate-rise flex-col gap-4 p-5 sm:p-7">
              <StepHeading step={2}>Your details</StepHeading>

              {method === 'pickup' && singleOption && (
                <div className="rounded-2xl bg-sage-50 p-4 text-sm leading-relaxed text-ink-700 ring-1 ring-sage-100">
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
                          aria-pressed={selectedAddressId === address.id}
                          className={clsx(
                            'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                            selectedAddressId === address.id
                              ? 'border-sage-800 bg-sage-800 text-cream-50'
                              : 'border-cream-300 bg-cream-50 text-ink-700 hover:border-sage-400',
                          )}
                        >
                          {address.label}: {address.address_line1}
                        </button>
                      ))}
                    </div>
                  )}
                  <Suspense fallback={<Spinner />}>
                    <LocationPicker value={pin} onChange={setPin} onPlaceFound={autofill.fillFromPlace} />
                  </Suspense>
                  {quote.data && (
                    <p
                      className={clsx(
                        'rounded-2xl p-3.5 text-sm font-medium',
                        riderZone ? 'bg-sage-50 text-sage-800 ring-1 ring-sage-100' : 'bg-gold-200 text-ink-800',
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
                  <p className="rounded-2xl bg-sage-50 p-4 text-sm leading-relaxed text-ink-700 ring-1 ring-sage-100">{singleOption.description}</p>
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
              <Textarea label="Order notes (optional)" rows={3} maxLength={1000} {...register('customer_notes')} />
            </section>
          )}

          {method && (
            <section className="card flex animate-rise flex-col gap-4 p-5 sm:p-7">
              <StepHeading step={3}>Payment</StepHeading>
              <PaymentMethodPicker value={payChoice} onChange={setPayChoice} phoneError={phoneError} idPrefix="checkout" />
            </section>
          )}
        </div>

        <div className="card h-fit p-6 sm:p-7 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl text-sage-900">Order summary</h2>
          <ul className="mt-5 flex flex-col gap-3.5">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm text-ink-700">
                <span className="relative shrink-0">
                  <ProductImage src={item.product.primary_image_url} seed={item.product.id} className="h-12 w-12 rounded-xl" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sage-800 px-1 text-[10px] font-bold text-cream-50">
                    {item.quantity}
                  </span>
                </span>
                <span className="min-w-0 flex-1 font-medium text-ink-800">
                  {item.product.name} <span className="sr-only">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-sage-900">{formatPrice(item.line_total, item.product.currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 border-t border-cream-300 pt-5 text-sm text-ink-700">
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
          <div className="mt-4 flex items-baseline justify-between border-t border-cream-300 pt-4 font-display text-sage-900">
            <span className="text-lg">Total</span>
            <span className="text-3xl">{formatPrice(subtotal + (deliveryFee ?? 0))}</span>
          </div>
          <Button
            type="submit"
            size="lg"
            isLoading={isPlacing}
            disabled={!method || Boolean(riderOutOfArea) || (method === 'rider' && !riderZone)}
            className="mt-6 w-full"
          >
            {payChoice.method === 'mpesa' ? 'Place order and pay with M-Pesa' : 'Continue to payment'}
          </Button>
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-sage-50 p-3.5 text-xs leading-relaxed text-ink-700">
            <ShieldCheck size={15} className="mt-px shrink-0 text-sage-600" aria-hidden="true" />
            {payChoice.method === 'mpesa'
              ? 'You’ll get an M-Pesa prompt on your phone. Payments are processed securely by Paystack.'
              : 'You’ll be redirected to Paystack to pay securely by card, M-Pesa or other options.'}
          </div>
          <p className="mt-3 text-xs text-ink-600">
            By continuing you agree to our{' '}
            <Link to="/terms" className="font-semibold text-sage-700 underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/refunds" className="font-semibold text-sage-700 underline">
              Refund Policy
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="mt-4 text-xs font-semibold text-sage-700 underline underline-offset-2"
          >
            Edit basket
          </button>
        </div>
      </form>
    </div>
  );
}
