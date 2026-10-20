import { Link } from 'react-router-dom';
import { Seo } from '../seo/Seo';

/** Shown when a product, expert, order or booking in the URL doesn't exist (or isn't yours). */
export function ItemNotFound({ title, linkTo, linkLabel }: { title: string; linkTo: string; linkLabel: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <Seo title={title} description={`${title}. ${linkLabel}.`} noindex />
      <h1 className="font-display text-2xl text-sage-900">{title}</h1>
      <Link to={linkTo} className="mt-4 inline-block text-sage-700 underline">
        {linkLabel}
      </Link>
    </div>
  );
}
