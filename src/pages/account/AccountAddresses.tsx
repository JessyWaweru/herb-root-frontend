import { lazy, Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { MapPin, MapPinOff, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { useAddresses, useCreateAddress, useDeleteAddress, useUpdateAddress } from '../../hooks/useAddresses';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Pin } from '../../components/checkout/LocationPicker';
import type { Place } from '../../lib/geocoding';
import { isValidPhone, PHONE_HELP } from '../../lib/phone';
import type { Address } from '../../types';

// Leaflet only loads when the form is opened.
const LocationPicker = lazy(() => import('../../components/checkout/LocationPicker'));

const schema = z.object({
  label: z.string().trim().min(1, 'Name this address, e.g. Home').max(50),
  full_name: z.string().trim().min(2, 'Enter the recipient’s name'),
  phone_number: z.string().trim().min(1, 'Enter a phone number').refine(isValidPhone, PHONE_HELP),
  address_line1: z.string().trim().min(2, 'Enter the street, building or house'),
  address_line2: z.string().trim().optional(),
  city: z.string().trim().min(2, 'Enter the town'),
  county_or_state: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
});

type AddressForm = z.infer<typeof schema>;

const toPin = (address: Address): Pin | null =>
  address.latitude && address.longitude
    ? { latitude: parseFloat(address.latitude), longitude: parseFloat(address.longitude) }
    : null;

export function AccountAddresses() {
  const { data: addresses, isLoading } = useAddresses();
  const user = useAuthStore((s) => s.user);
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  // null: form closed, 'new': adding, otherwise the address being edited.
  const [editing, setEditing] = useState<Address | 'new' | null>(null);
  const [pin, setPin] = useState<Pin | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AddressForm>({ resolver: zodResolver(schema) });

  const openForm = (address: Address | 'new') => {
    setEditing(address);
    if (address === 'new') {
      reset({
        label: addresses?.length ? '' : 'Home',
        full_name: [user?.first_name, user?.last_name].filter(Boolean).join(' '),
        phone_number: user?.phone_number ?? '',
      });
      setPin(null);
    } else {
      reset({
        label: address.label,
        full_name: address.full_name,
        phone_number: address.phone_number,
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        city: address.city,
        county_or_state: address.county_or_state,
        landmark: address.landmark,
      });
      setPin(toPin(address));
    }
  };

  const closeForm = () => {
    setEditing(null);
    setPin(null);
  };

  // Prefill empty fields from the pin, without overwriting what was typed.
  const fillFromPlace = (place: Place) => {
    const fill = (field: 'address_line1' | 'address_line2' | 'city' | 'county_or_state', value: string) => {
      if (value && !getValues(field)) setValue(field, value);
    };
    fill('address_line1', place.road);
    fill('address_line2', place.area);
    fill('city', place.city);
    fill('county_or_state', place.county);
  };

  const onSubmit = (values: AddressForm) => {
    if (!pin) {
      toast.error('Drop a pin on the map so our rider can find this address.');
      return;
    }
    const payload = {
      ...values,
      address_line2: values.address_line2 ?? '',
      county_or_state: values.county_or_state ?? '',
      landmark: values.landmark ?? '',
      latitude: pin.latitude.toFixed(6),
      longitude: pin.longitude.toFixed(6),
    };
    if (editing === 'new') {
      createAddress.mutate(
        { ...payload, postal_code: '', country: 'Kenya', is_default: !addresses?.length },
        { onSuccess: closeForm },
      );
    } else if (editing) {
      updateAddress.mutate({ id: editing.id, payload }, { onSuccess: closeForm });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col gap-6">
      {(!addresses || addresses.length === 0) && !editing && (
        <EmptyState
          icon="📍"
          title="No saved addresses yet"
          description="Save where you'd like riders to deliver, and checkout fills it in for you."
          action={
            <Button icon={<Plus size={15} />} onClick={() => openForm('new')}>
              Add address
            </Button>
          }
        />
      )}

      {addresses && addresses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => {
            const hasPin = toPin(addr) !== null;
            return (
              <div key={addr.id} className="flex flex-col rounded-2xl border border-cream-300 bg-cream-50 p-5">
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
                  {[addr.address_line1, addr.address_line2, addr.city].filter(Boolean).join(', ')}
                </p>
                {addr.landmark && <p className="text-sm text-ink-600">Near: {addr.landmark}</p>}
                <p className="text-sm text-ink-600">{addr.phone_number}</p>
                {hasPin ? (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-sage-700">
                    <MapPin size={12} /> Map pin saved
                  </p>
                ) : (
                  <button
                    onClick={() => openForm(addr)}
                    className="mt-2 flex w-fit items-center gap-1 rounded-full bg-gold-300/40 px-2.5 py-1 text-xs font-semibold text-gold-600"
                  >
                    <MapPinOff size={12} /> No map pin — add one for rider delivery
                  </button>
                )}
                <div className="mt-auto flex gap-4 pt-3">
                  <button
                    onClick={() => openForm(addr)}
                    className="flex items-center gap-1 text-xs font-semibold text-sage-700 hover:underline"
                  >
                    <Pencil size={12} /> Edit
                  </button>
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
            );
          })}
        </div>
      )}

      {!editing ? (
        addresses &&
        addresses.length > 0 && (
          <Button variant="outline" icon={<Plus size={15} />} className="w-fit" onClick={() => openForm('new')}>
            Add another address
          </Button>
        )
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-w-2xl flex-col gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-6"
        >
          <h2 className="font-display text-lg text-sage-900">
            {editing === 'new' ? 'Add an address' : `Edit “${editing.label}”`}
          </h2>
          <Suspense fallback={<Spinner />}>
            <LocationPicker
              key={editing === 'new' ? 'new' : editing.id}
              value={pin}
              onChange={setPin}
              onPlaceFound={fillFromPlace}
            />
          </Suspense>
          <Input label="Street, building or house" {...register('address_line1')} error={errors.address_line1?.message} />
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
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Label" placeholder="Home, Office…" {...register('label')} error={errors.label?.message} />
            <Input label="Recipient's name" autoComplete="name" {...register('full_name')} error={errors.full_name?.message} />
            <Input
              label="Phone number"
              type="tel"
              autoComplete="tel"
              {...register('phone_number')}
              error={errors.phone_number?.message}
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" isLoading={createAddress.isPending || updateAddress.isPending}>
              Save address
            </Button>
            <Button type="button" variant="ghost" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
