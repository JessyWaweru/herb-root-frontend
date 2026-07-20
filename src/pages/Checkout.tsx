import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAddresses } from '../hooks/useAddresses';
import { useCheckout } from '../hooks/useOrders';
import { useInitializePayment } from '../hooks/usePayments';
import { PageSpinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { formatPrice } from '../lib/format';
import { apiErrorMessage } from '../lib/api';

const addressSchema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  phone_number: z.string().min(7, 'Enter a valid phone number'),
  address_line1: z.string().min(3, 'Enter your street address'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'Enter your city'),
  county_or_state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(2),
  customer_notes: z.string().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;

export function Checkout() {
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new' | null>(null);
  const checkoutMutation = useCheckout();
  const initializePayment = useInitializePayment();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'Kenya' },
  });

  if (cartLoading || addressesLoading) return <PageSpinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EmptyState icon="🧺" title="Your basket is empty" description="Add a few remedies before checking out." />
      </div>
    );
  }

  const usingSavedAddress = selectedAddressId && selectedAddressId !== 'new';

  const placeOrder = async (formValues?: AddressForm) => {
    try {
      const payload = usingSavedAddress
        ? { address_id: selectedAddressId as string }
        : { ...formValues };

      const order = await checkoutMutation.mutateAsync(payload);
      const payment = await initializePayment.mutateAsync(order.order_number);
      window.location.href = payment.authorization_url;
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not place your order.'));
    }
  };

  const onSubmitNewAddress = (values: AddressForm) => placeOrder(values);
  const onUseSavedAddress = () => placeOrder();

  const isPlacing = checkoutMutation.isPending || initializePayment.isPending;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-sage-900">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          {addresses && addresses.length > 0 && (
            <div className="mb-6 flex flex-col gap-3">
              <h2 className="font-display text-lg text-sage-900">Shipping address</h2>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    selectedAddressId === addr.id ? 'border-sage-500 bg-sage-50' : 'border-cream-300 bg-cream-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-1"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-sage-900">{addr.label} — {addr.full_name}</p>
                    <p className="text-ink-600">
                      {addr.address_line1}, {addr.city}, {addr.country}
                    </p>
                    <p className="text-ink-600">{addr.phone_number}</p>
                  </div>
                </label>
              ))}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                  selectedAddressId === 'new' ? 'border-sage-500 bg-sage-50' : 'border-cream-300 bg-cream-50'
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === 'new'}
                  onChange={() => setSelectedAddressId('new')}
                />
                <span className="text-sm font-semibold text-sage-900">Use a new address</span>
              </label>
            </div>
          )}

          {(!addresses || addresses.length === 0 || selectedAddressId === 'new') && (
            <form onSubmit={handleSubmit(onSubmitNewAddress)} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" {...register('full_name')} error={errors.full_name?.message} />
                <Input label="Phone number" {...register('phone_number')} error={errors.phone_number?.message} />
              </div>
              <Input label="Address line 1" {...register('address_line1')} error={errors.address_line1?.message} />
              <Input label="Address line 2 (optional)" {...register('address_line2')} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="City" {...register('city')} error={errors.city?.message} />
                <Input label="County / State" {...register('county_or_state')} />
                <Input label="Postal code" {...register('postal_code')} />
              </div>
              <Input label="Country" {...register('country')} error={errors.country?.message} />
              <Textarea label="Order notes (optional)" rows={3} {...register('customer_notes')} />

              <Button type="submit" size="lg" isLoading={isPlacing} className="mt-2">
                Continue to payment
              </Button>
            </form>
          )}

          {usingSavedAddress && (
            <Button size="lg" isLoading={isPlacing} onClick={onUseSavedAddress} className="mt-2">
              Continue to payment
            </Button>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-cream-300 bg-cream-50 p-6">
          <h3 className="font-display text-lg text-sage-900">Order summary</h3>
          <div className="mt-4 flex flex-col gap-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-ink-700">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.line_total, item.product.currency)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-cream-300 pt-4 font-display text-lg text-sage-900">
            <span>Total</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          <div className="mt-4 flex items-start gap-2 text-xs text-ink-600">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-sage-600" />
            You'll be redirected to Paystack to complete payment securely via card or M-Pesa.
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="mt-4 text-xs font-semibold text-sage-700 underline"
          >
            Edit basket
          </button>
        </div>
      </div>
    </div>
  );
}
