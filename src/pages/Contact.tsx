import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { sendContactMessage, type ContactPayload } from '../lib/core';
import { apiErrorMessage } from '../lib/api';

export function Contact() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<ContactPayload>();

  const onSubmit = async (values: ContactPayload) => {
    setLoading(true);
    try {
      const { detail } = await sendContactMessage(values);
      toast.success(detail);
      reset();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-sage-900 sm:text-4xl">Get in touch</h1>
      <p className="mt-3 max-w-lg text-ink-600">
        Questions about a remedy, an order, or growing partnerships? We'd love to hear from you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-5">
          <ContactRow icon={Mail} label="Email" value="hello@herbandroot.test" />
          <ContactRow icon={Phone} label="Phone" value="+254 700 000 000" />
          <ContactRow icon={MapPin} label="Studio" value="Nairobi, Kenya" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-3xl border border-cream-300 bg-cream-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" {...register('name', { required: true })} />
            <Input label="Email" type="email" {...register('email', { required: true })} />
          </div>
          <Input label="Subject (optional)" {...register('subject')} />
          <Textarea label="Message" rows={5} {...register('message', { required: true })} />
          <Button type="submit" isLoading={loading} className="w-fit">
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-700">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-600/70">{label}</p>
        <p className="text-sm font-semibold text-sage-900">{value}</p>
      </div>
    </div>
  );
}
