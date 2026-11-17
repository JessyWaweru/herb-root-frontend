import { ArrowRight } from 'lucide-react';
import { Seo } from '../seo/Seo';
import { ButtonLink } from './Button';
import { Sprig } from '../art/Botanical';

/** Shown when a product, expert, order or booking in the URL doesn't exist (or isn't yours). */
export function ItemNotFound({ title, linkTo, linkLabel }: { title: string; linkTo: string; linkLabel: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <Seo title={title} description={`${title}. ${linkLabel}.`} noindex />
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-sage-100 ring-8 ring-sage-50" aria-hidden="true">
        <Sprig className="h-16 rotate-[18deg] text-sage-600" leaves={5} />
      </span>
      <h1 className="mt-8 text-balance font-display text-3xl leading-tight text-sage-900 sm:text-4xl">{title}</h1>
      <ButtonLink to={linkTo} variant="outline" className="mt-7">
        {linkLabel}
        <ArrowRight size={15} aria-hidden="true" />
      </ButtonLink>
    </div>
  );
}
