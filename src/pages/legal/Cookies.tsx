import { Link } from 'react-router-dom';
import { ContactLine, LegalPage, Section } from '../../components/legal/LegalPage';

// Every cookie and browser-storage item the site sets. If you add one (or any analytics or
// tracking), update this list - and non-essential ones need consent before they're set.
export function Cookies() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro={
        <p>
          Cookies are small files a website stores in your browser. We only use the few that are strictly necessary
          to keep you signed in and keep the site secure. We don't use analytics, advertising or tracking cookies.
        </p>
      }
    >
      <Section title="Cookies we set">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">What it does</th>
                <th scope="col">How long</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>goherbal_access</td>
                <td>Keeps you signed in. Page scripts can't read it.</td>
                <td>30 minutes</td>
              </tr>
              <tr>
                <td>goherbal_refresh</td>
                <td>Renews your sign-in so you don't have to sign in again every 30 minutes. Only sent when renewing.</td>
                <td>14 days, or until you sign out</td>
              </tr>
              <tr>
                <td>csrftoken</td>
                <td>Stops other websites from submitting forms on your behalf (a security protection).</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>sessionid</td>
                <td>Only for our staff when they use the admin area.</td>
                <td>2 weeks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Other storage in your browser">
        <p>
          While you're signed in, your browser's local storage keeps a copy of your profile (name, email, phone number
          and account settings) under <strong>goherbal-auth</strong>, so pages can show you as signed in straight away.
          It holds no password or sign-in token, and it's cleared when you sign out.
        </p>
      </Section>

      <Section title="Other companies' cookies">
        <p>Some features load from other companies, which may set their own cookies under their own policies:</p>
        <ul className="bullets">
          <li>
            <strong>Cloudflare</strong> runs the "I'm human" check on the sign-up and password-reset pages.
          </li>
          <li>
            <strong>Paystack</strong> runs the payment page you're sent to at checkout.
          </li>
          <li>
            <strong>OpenStreetMap</strong> provides the map when you choose a delivery location.
          </li>
        </ul>
      </Section>

      <Section title="Why there's no cookie banner">
        <p>
          Because we only use cookies the site can't work without, there's nothing to opt in or out of, so we don't
          show a banner. If we ever add cookies that aren't strictly necessary, such as analytics, we'll ask for your
          consent first.
        </p>
      </Section>

      <Section title="Controlling cookies">
        <p>
          You can block or delete cookies in your browser settings. If you block ours, you won't be able to sign in or
          check out. For how we use your data more generally, see our <Link to="/privacy">Privacy Policy</Link>.
          Questions? <ContactLine />.
        </p>
      </Section>
    </LegalPage>
  );
}
