import { Toaster } from 'react-hot-toast';

/**
 * Pop-up messages. An open modal <dialog> sits in the browser's top layer, above anything
 * else on the page, so each dialog renders its own copy inside itself and the page's copy
 * is hidden meanwhile (see index.css).
 */
export function AppToaster({ inDialog = false }: { inDialog?: boolean }) {
  return (
    <Toaster
      position="top-center"
      containerClassName={inDialog ? undefined : 'page-toaster'}
      toastOptions={{
        style: {
          background: '#3f5d3a',
          color: '#fbf7ee',
          borderRadius: '9999px',
          fontSize: '14px',
        },
      }}
    />
  );
}
