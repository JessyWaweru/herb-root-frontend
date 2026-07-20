import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { verifyEmail } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { PageSpinner } from '../../components/ui/Spinner';

export function VerifyEmail() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const attempted = useRef(false);

  useEffect(() => {
    if (!uid || !token || attempted.current) return;
    attempted.current = true;
    verifyEmail(uid, token)
      .then(() => setStatus('success'))
      .catch((error) => {
        setMessage(apiErrorMessage(error, 'This verification link is invalid or has expired.'));
        setStatus('error');
      });
  }, [uid, token]);

  if (status === 'loading') return <PageSpinner />;

  return (
    <AuthLayout title="Email verification">
      <div className="flex flex-col items-center gap-3 text-center">
        {status === 'success' ? (
          <>
            <CheckCircle2 size={40} className="text-sage-600" />
            <p className="text-ink-700">Your email is verified. Welcome to Herb &amp; Root!</p>
            <Link to="/account">
              <Button className="mt-2">Go to my account</Button>
            </Link>
          </>
        ) : (
          <>
            <XCircle size={40} className="text-rose-500" />
            <p className="text-ink-700">{message}</p>
            <Link to="/account">
              <Button variant="outline" className="mt-2">
                Back to account
              </Button>
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
