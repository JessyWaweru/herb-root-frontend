import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const LAYER_ID = 'toast-layer';

/**
 * An open modal <dialog> sits in the browser's top layer, above anything else on the page.
 * The toaster lives in a manual popover, which is in the top layer too, so re-showing it
 * after a dialog opens puts pop-up messages back on top of the dialog and its blur.
 */
export function raiseToasts() {
  const layer = document.getElementById(LAYER_ID);
  if (!layer || !('showPopover' in layer)) return;
  if (layer.matches(':popover-open')) layer.hidePopover();
  layer.showPopover();
}

export function AppToaster() {
  useEffect(raiseToasts, []);

  return (
    <div id={LAYER_ID} popover="manual" className="toast-layer">
      <Toaster
        position="top-center"
        containerStyle={{ top: 20 }}
        toastOptions={{
          style: {
            background: '#0a3829',
            color: '#fffdf8',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: 600,
            padding: '10px 18px 10px 12px',
            border: '1px solid rgba(143, 210, 177, 0.25)',
            boxShadow: '0 2px 6px rgba(6, 36, 26, 0.2), 0 24px 48px -16px rgba(6, 36, 26, 0.5)',
            maxWidth: 'min(92vw, 28rem)',
          },
          success: { iconTheme: { primary: '#e8b751', secondary: '#0a3829' } },
          error: { iconTheme: { primary: '#e49c84', secondary: '#0a3829' } },
        }}
      />
    </div>
  );
}
