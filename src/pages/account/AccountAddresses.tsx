import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Star, Trash2 } from 'lucide-react';
import { useAddresses, useCreateAddress, useDeleteAddress, useUpdateAddress } from '../../hooks/useAddresses';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Address } from '../../types';

type AddressFormValues = Omit<Address, 'id' | 'created_at' | 'is_default'>;

export function AccountAddresses() {
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<AddressFormValues>({
    defaultValues: { label: 'Home', country: 'Kenya' },
  });

  const onSubmit = (values: AddressFormValues) => {
    createAddress.mutate(
      { ...values, is_default: false },
      {
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
      },
    );
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col gap-6">
      {(!addresses || addresses.length === 0) && !showForm && (
        <EmptyState
          icon="📍"
          title="No saved addresses yet"
          description="Add one to speed up checkout next time."
          action={
            <Button icon={<Plus size={15} />} onClick={() => setShowForm(true)}>
              Add address
            </Button>
          }
        />
      )}

      {addresses && addresses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-2xl border border-cream-300 bg-cream-50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sage-900">{addr.label}</p>
                  <p className="text-sm text-ink-700">{addr.full_name}</p>
                </div>
                {addr.is_default && (
                  <span className="flex items-center gap-1 rounded-full bg-gold-300/50 px-2 py-0.5 text-xs font-semibold text-gold-600">
                    <Star size={11} className="fill-current" /> Default
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-ink-600">
                {addr.address_line1}, {addr.city}, {addr.country}
              </p>
              <p className="text-sm text-ink-600">{addr.phone_number}</p>
              <div className="mt-3 flex gap-3">
                {!addr.is_default && (
                  <button
                    onClick={() => updateAddress.mutate({ id: addr.id, payload: { is_default: true } })}
                    className="text-xs font-semibold text-sage-700 hover:underline"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => deleteAddress.mutate(addr.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        addresses &&
        addresses.length > 0 && (
          <Button variant="outline" icon={<Plus size={15} />} className="w-fit" onClick={() => setShowForm(true)}>
            Add another address
          </Button>
        )
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-lg flex-col gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Label" placeholder="Home, Office..." {...register('label', { required: true })} />
            <Input label="Full name" {...register('full_name', { required: true })} />
          </div>
          <Input label="Phone number" {...register('phone_number', { required: true })} />
          <Input label="Address line 1" {...register('address_line1', { required: true })} />
          <Input label="Address line 2" {...register('address_line2')} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="City" {...register('city', { required: true })} />
            <Input label="County / State" {...register('county_or_state')} />
            <Input label="Postal code" {...register('postal_code')} />
          </div>
          <Input label="Country" {...register('country', { required: true })} />
          <div className="flex gap-3">
            <Button type="submit" isLoading={createAddress.isPending}>
              Save address
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
