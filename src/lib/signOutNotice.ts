// Why the browser was just signed out (e.g. too many wrong passwords), for the sign-in page
// to explain. Kept outside router state because other redirects to sign-in can race it.
let notice: string | null = null;

export const setSignOutNotice = (message: string) => {
  notice = message;
};

export const peekSignOutNotice = () => notice;

export const clearSignOutNotice = () => {
  notice = null;
};
