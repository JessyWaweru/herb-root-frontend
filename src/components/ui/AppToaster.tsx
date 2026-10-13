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
        toastOptions={{
          style: {
            background: '#3f5d3a',
            color: '#fbf7ee',
            borderRadius: '9999px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}
