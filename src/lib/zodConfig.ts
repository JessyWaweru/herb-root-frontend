import { z } from 'zod';

// The Content-Security-Policy forbids eval; tell zod up front instead of letting it probe.
// Imported first in main.tsx, because schemas are built as soon as their modules load.
z.config({ jitless: true });
