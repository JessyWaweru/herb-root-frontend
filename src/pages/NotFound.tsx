import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <span className="text-6xl">🥀</span>
      <h1 className="mt-4 font-display text-3xl text-sage-900">This page has wilted away</h1>
      <p className="mt-2 text-ink-600">We couldn't find what you were looking for.</p>
      <Link to="/">
        <Button className="mt-6">Back to home</Button>
      </Link>
    </div>
  );
}
