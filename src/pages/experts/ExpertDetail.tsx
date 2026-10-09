import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { BadgeCheck, Clock, Languages, Mail, Phone, ShieldCheck, Video } from 'lucide-react';
import { useBookConsultation, useExpert } from '../../hooks/useConsultations';
import { useInitializeConsultationPayment } from '../../hooks/usePayments';
import { useAuthStore } from '../../stores/authStore';
import { PageSpinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { ExpertAvatar } from '../../components/experts/ExpertCard';
import { formatPrice } from '../../lib/format';
import { apiErrorMessage } from '../../lib/api';
import type { ConsultationMode } from '../../types';

const MODE_META: Record<ConsultationMode, { label: string; icon: typeof Phone }> = {
  email: { label: 'Email', icon: Mail },
  phone: { label: 'Phone call', icon: Phone },
  video: { label: 'Video call', icon: Video },
};

const bookingSchema = z
  .object({
    mode: z.enum(['email', 'phone', 'video'], { message: 'Choose how you’d like to talk' }),
    preferred_time: z.string().min(1, 'Pick a day and time'),
    phone_number: z.string().optional(),
    concern: z.string().min(10, 'Tell the expert a little more (at least 10 characters)'),
    consent: z.literal(true, { message: 'Please agree so we can share your details with the expert' }),
  })
  .refine((values) => values.mode !== 'phone' || (values.phone_number?.trim().length ?? 0) >= 9, {
    path: ['phone_number'],
    message: 'Enter the number the expert should call',
  });

type BookingForm = z.infer<typeof bookingSchema>;

// A datetime-local value one hour from now, the earliest bookable time.
function earliestSlot() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function ExpertDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: expert, isLoading } = useExpert(slug);
  const { isAuthenticated, user } = useAuthStore();
  const book = useBookConsultation();
  const pay = useInitializeConsultationPayment();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { phone_number: user?.phone_number ?? '' },
  });
  const selectedMode = watch('mode');

  if (isLoading) return <PageSpinner />;

  if (!expert) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-sage-900">Expert not found</h1>
        <Link to="/experts" className="mt-4 inline-block text-sage-700 underline">
          See all experts
        </Link>
      </div>
    );
  }

  const isFree = !Number(expert.fee);

  const onSubmit = async (values: BookingForm) => {
    try {
      const consultation = await book.mutateAsync({
        ...values,
        expert_id: expert.id,
        preferred_time: new Date(values.preferred_time).toISOString(),
      });
      if (consultation.status !== 'pending_payment') {
        navigate(`/consultations/${consultation.reference}`);
        return;
      }
      const payment = await pay.mutateAsync(consultation.reference);
      window.location.href = payment.authorization_url;
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not book your consultation.'));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/experts" className="text-sm font-semibold text-sage-700 hover:underline">
        ← All experts
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex items-center gap-5">
            <ExpertAvatar expert={expert} size="lg" />
            <div>
              <h1 className="font-display text-3xl text-sage-900">{expert.name}</h1>
              <p className="text-ink-700">{expert.title}</p>
              <p className="mt-1 text-sm font-semibold text-sage-700">{expert.kind_label}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-700">
            <span className="flex items-center gap-1.5">
              <Clock size={15} className="text-sage-600" /> {expert.session_minutes}-minute session
            </span>
            <span className="flex items-center gap-1.5">
              <Languages size={15} className="text-sage-600" /> {expert.languages}
            </span>
            {expert.licence_number && (
              <span className="flex items-center gap-1.5">
                <BadgeCheck size={15} className="text-sage-600" /> Licence no. {expert.licence_number}
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-800">{expert.bio}</p>

          {expert.specialties && (
            <div className="mt-6 flex flex-wrap gap-2">
              {expert.specialties.split(',').map((specialty) => (
                <span key={specialty} className="rounded-full bg-sage-50 px-3 py-1 text-sm text-sage-800">
                  {specialty.trim()}
                </span>
              ))}
            </div>
          )}

          {expert.kind === 'herbal_coach' && (
            <p className="mt-8 rounded-xl bg-cream-200 p-4 text-xs text-ink-600">
              Herbal coaches share guidance on traditional remedies and wellbeing. This isn't a medical diagnosis. If
              you're pregnant, on medication or have a long-term condition, also speak to a doctor.
            </p>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-cream-300 bg-cream-50 p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl text-sage-900">Book a session</h2>
            <span className="font-display text-xl text-sage-900">{isFree ? 'Free' : formatPrice(expert.fee, expert.currency)}</span>
          </div>

          {!isAuthenticated ? (
            <div className="mt-5 flex flex-col gap-3 text-sm text-ink-700">
              <p>Sign in to book, so you can follow your booking from your account.</p>
              <Button onClick={() => navigate('/login', { state: { from: location } })}>Sign in to book</Button>
              <Link to="/register" className="text-center text-xs font-semibold text-sage-700 underline">
                New here? Create an account
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
              <fieldset>
                <legend className="text-sm font-medium text-ink-700">How would you like to talk?</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {expert.modes.map((mode) => {
                    const { label, icon: Icon } = MODE_META[mode];
                    return (
                      <label
                        key={mode}
                        className={clsx(
                          'flex cursor-pointer flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition',
                          selectedMode === mode ? 'border-sage-500 bg-sage-50 text-sage-800' : 'border-cream-300 text-ink-700',
                        )}
                      >
                        <input type="radio" value={mode} {...register('mode')} className="sr-only" />
                        <Icon size={18} />
                        {label}
                      </label>
                    );
                  })}
                </div>
                {errors.mode && <span className="text-xs text-rose-600">{errors.mode.message}</span>}
              </fieldset>

              <Input
                label="Preferred day and time"
                type="datetime-local"
                min={earliestSlot()}
                {...register('preferred_time')}
                error={errors.preferred_time?.message}
              />
              {selectedMode === 'phone' && (
                <Input label="Number to call" type="tel" {...register('phone_number')} error={errors.phone_number?.message} />
              )}
              <Textarea
                label="What would you like help with?"
                rows={4}
                placeholder="Symptoms, how long you've had them, any medication you take…"
                {...register('concern')}
                error={errors.concern?.message}
              />

              <label className="flex items-start gap-2 text-xs text-ink-700">
                <input type="checkbox" className="mt-0.5" {...register('consent')} />
                <span>
                  I agree to share these health details with {expert.name} and the GOherbal team, only to arrange and
                  carry out this consultation.
                </span>
              </label>
              {errors.consent && <span className="-mt-3 text-xs text-rose-600">{errors.consent.message}</span>}

              <Button type="submit" size="lg" isLoading={book.isPending || pay.isPending}>
                {isFree ? 'Book session' : 'Continue to payment'}
              </Button>
              <p className="flex items-start gap-2 text-xs text-ink-600">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-sage-600" />
                {isFree
                  ? `The expert will email you at ${user?.email} to confirm the exact time.`
                  : `Pay securely with M-Pesa or card. The expert will email you at ${user?.email} to confirm the exact time.`}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
