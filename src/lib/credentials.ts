interface PasswordCredentialCtor {
  new (data: { id: string; password: string; name?: string }): Credential;
}

/**
 * Explicitly offers the browser's "save password?" prompt. Chromium browsers support
 * this; elsewhere the form's autocomplete attributes let the browser detect the sign-in.
 */
export async function offerToSavePassword(email: string, password: string, name?: string) {
  const Ctor = (window as unknown as { PasswordCredential?: PasswordCredentialCtor }).PasswordCredential;
  if (!Ctor || !navigator.credentials?.store) return;
  try {
    await navigator.credentials.store(new Ctor({ id: email, password, name: name || email }));
  } catch {
    // The user dismissed it or the browser refused; nothing to do.
  }
}
