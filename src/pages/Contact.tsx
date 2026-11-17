import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { sendContactMessage, type ContactPayload } from '../lib/core';
import { apiErrorMessage } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { PageHero } from '../components/layout/PageHero';
import { CRUMBS } from '../seo/site';

export function Contact() {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { register, handleSubmit, reset } = useForm<ContactPayload>();
  const userName = user ? `${user.first_name} ${user.last_name}`.trim() || user.email : '';

  const onSubmit = async (values: ContactPayload) => {
    setLoading(true);
    try {
      // Signed-in customers aren't asked for details we already have.
      const payload = user ? { ...values, name: userName, email: user.email } : values;
      const { detail } = await sendContactMessage(payload);
      toast.success(detail);
      reset();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHero
        crumbs={CRUMBS['/contact']}
        eyebrow="Contact"
        title={
          <>
            Get in <em>touch</em>
          </>
        }
        description="Questions about a remedy, an order, or growing partnerships? We'd love to hear from you."
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-3">
          <ContactRow icon={Mail} label="Email" value="hello@goherbal.health" href="mailto:hello@goherbal.health" />
          <ContactRow icon={Phone} label="Phone" value="0115393779" href="tel:0115393779" />
          <ContactRow icon={MapPin} label="Studio" value="JBNMedia · Nairobi, Kenya" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card flex flex-col gap-5 p-6 sm:p-8">
          <h2 className="font-display text-2xl text-sage-900">Send us a message</h2>
          {user ? (
            <p className="rounded-2xl bg-sage-50 p-3.5 text-sm text-ink-700 ring-1 ring-sage-100">
              Sending as <span className="font-semibold text-sage-900">{userName}</span> ({user.email})
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Name" {...register('name', { required: true })} />
              <Input label="Email" type="email" {...register('email', { required: true })} />
            </div>
          )}
          <Input label="Subject (optional)" {...register('subject')} />
          <Textarea label="Message" rows={6} maxLength={5000} {...register('message', { required: true })} />
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs text-xs leading-relaxed text-ink-600">
              We'll only use your details to reply to you. See our{' '}
              <Link to="/privacy" className="font-semibold text-sage-700 underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
            <Button type="submit" size="lg" isLoading={loading} icon={<Send size={16} />} className="shrink-0">
              Send message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href?: string }) {
  const body = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-800 text-gold-400 shadow-press">
        <Icon size={19} aria-hidden="true" />
      </span>
      <span>
        <span className="eyebrow block text-[10px] text-ink-600">{label}</span>
        <span className="mt-1 block font-display text-xl leading-tight text-sage-900">{value}</span>
      </span>
    </>
  );
  const className = 'card flex items-center gap-4 p-5';
  return href ? (
    <a href={href} className={`${className} transition duration-300 hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-lift`}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
