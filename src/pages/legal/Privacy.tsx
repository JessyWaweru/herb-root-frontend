import { Link } from 'react-router-dom';
import { ContactLine, LegalPage, Section } from '../../components/legal/LegalPage';
import { LEGAL } from '../../lib/legal';

// Keep this in step with what the site actually collects. If a form, provider or
// cookie is added or removed, update this page (and the Cookie Policy) in the same change.
export function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          This policy explains what personal data {LEGAL.businessName} collects when you use {LEGAL.website}, why, who
          we share it with, how long we keep it, and the rights you have under Kenya's Data Protection Act, 2019. We
          only collect what we need to sell you remedies, deliver them, arrange consultations and keep your account
          safe.
        </p>
      }
    >
      <Section title="1. Who we are">
        <p>
          {LEGAL.businessName} ("we", "us"), trading as {LEGAL.tradingName} and based in {LEGAL.location}, is the data
          controller for the personal data described here. For anything about your data, <ContactLine />.
        </p>
      </Section>

      <Section title="2. What we collect and why">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">What</th>
                <th scope="col">Why we need it</th>
                <th scope="col">Legal basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account: email, first and last name, phone number, password (stored only in scrambled, hashed form)</td>
                <td>To create and secure your account, sign you in, and contact you about your orders</td>
                <td>Contract</td>
              </tr>
              <tr>
                <td>Saved addresses: recipient name and phone, street, building, town, county, landmark and the map pin you drop</td>
                <td>So riders and couriers can find you and checkout can fill your details in</td>
                <td>Contract</td>
              </tr>
              <tr>
                <td>Orders: what you bought, prices, delivery method, delivery details and any notes you add</td>
                <td>To deliver your order, handle problems and refunds, and keep the sales records the law requires</td>
                <td>Contract; legal obligation</td>
              </tr>
              <tr>
                <td>Payments: payment reference, amount, currency, method (e.g. card or M-Pesa) and status</td>
                <td>
                  To confirm you paid and to reconcile our accounts. Card details are entered on Paystack's page and never
                  reach our servers. If you choose an M-Pesa prompt, your M-Pesa number passes through our server to
                  Paystack to send the prompt, and we don't keep it with your payment
                </td>
                <td>Contract; legal obligation</td>
              </tr>
              <tr>
                <td>Consultations: the expert you choose, how and when you'd like to talk, your phone number for phone sessions, and the health concern you describe</td>
                <td>To arrange your consultation and let the expert prepare. Health details are sensitive personal data; we only collect them with your explicit consent, given in the booking form</td>
                <td>Explicit consent; contract</td>
              </tr>
              <tr>
                <td>Messages: what you send through the contact form or to an @{LEGAL.website} email address</td>
                <td>To answer you</td>
                <td>Legitimate interests</td>
              </tr>
              <tr>
                <td>Garden letter: your email address</td>
                <td>To send our newsletter, only if you ask for it</td>
                <td>Consent</td>
              </tr>
              <tr>
                <td>Reviews, wishlist and basket</td>
                <td>To show your review on the product (with your first name and last initial only), and to remember what you saved</td>
                <td>Contract</td>
              </tr>
              <tr>
                <td>Garden Points: the points you earn and spend, and your vouchers</td>
                <td>To run the points scheme you join by shopping with us</td>
                <td>Contract</td>
              </tr>
              <tr>
                <td>Review reminders: which of your delivered products you haven't reviewed yet</td>
                <td>
                  To email you a few days after an order arrives, and now and then ask on the site, whether you'd like to
                  review it. You can turn these off in every email and under My account → Points
                </td>
                <td>Legitimate interests</td>
              </tr>
              <tr>
                <td>Your location, only when you tap "Use my location"</td>
                <td>To place the map pin for delivery. Your browser asks your permission first; we only keep the pin you save</td>
                <td>Consent</td>
              </tr>
              <tr>
                <td>Security data: failed sign-in attempts, one-time codes, and a bot check on sign-up and password reset</td>
                <td>To protect accounts from break-ins and the site from abuse</td>
                <td>Legitimate interests</td>
              </tr>
              <tr>
                <td>Technical data: your IP address and browser details in our hosting provider's server logs</td>
                <td>To run, secure and fix the site</td>
                <td>Legitimate interests</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          We don't use analytics, advertising or tracking tools, we don't build profiles of you, and we don't make
          decisions about you by automated means. We never sell your data.
        </p>
      </Section>

      <Section title="3. Who we share it with">
        <p>We share only what each party needs to do its job:</p>
        <ul className="bullets">
          <li>
            <strong>Riders and pickup agents</strong> get your first name, phone number, delivery address and map pin
            for your order only. A rider's link to your details stops working once the order is delivered or cancelled.
          </li>
          <li>
            <strong>The expert you book</strong> gets your name, contact details and the concern you describe, to carry
            out your consultation.
          </li>
          <li>
            <strong>Paystack</strong> processes payments, either on Paystack's own page or by sending an M-Pesa prompt
            to the number you give us, under{' '}
            <a href="https://paystack.com/privacy/merchant" target="_blank" rel="noopener noreferrer">
              Paystack's privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Resend</strong> sends and receives our emails (order confirmations, codes, replies).
          </li>
          <li>
            <strong>Africa's Talking</strong> sends text messages to riders with their delivery link, when SMS is
            switched on.
          </li>
          <li>
            <strong>Cloudflare</strong> runs the "I'm human" check on sign-up and password reset.
          </li>
          <li>
            <strong>OpenStreetMap</strong> provides the map and address search. When you use the map, your browser
            loads map images from OpenStreetMap and sends it the place you search for, along with your IP address.
          </li>
          <li>
            <strong>Our hosting providers</strong> store the site and its database.
          </li>
          <li>
            <strong>Authorities</strong>, when the law requires it.
          </li>
        </ul>
        <p>
          Some of these providers store or process data outside Kenya. When that happens we rely on the safeguards the
          Data Protection Act, 2019 allows, such as the provider's data-protection commitments.
        </p>
      </Section>

      <Section title="4. How long we keep it">
        <ul className="bullets">
          <li>Your account and saved details: until you delete your account.</li>
          <li>
            When you delete your account, we erase your name, email, phone, addresses, reviews, wishlist, basket and
            consultation notes, and your Garden Points end. We keep a record of past purchases (items, amounts and the town) without your name or
            address, because tax law requires us to keep sales records (generally for five years).
          </li>
          <li>Garden letter: until you unsubscribe.</li>
          <li>Messages you send us: while we need them to help you; you can ask us to delete them.</li>
          <li>Server logs: for the period our hosting provider keeps them.</li>
        </ul>
      </Section>

      <Section title="5. Your rights">
        <p>Under the Data Protection Act, 2019 you have the right to:</p>
        <ul className="bullets">
          <li>be told how your data is used (this page);</li>
          <li>get a copy of the personal data we hold about you;</li>
          <li>have wrong or incomplete data corrected;</li>
          <li>have your data deleted, and object to how we use it;</li>
          <li>withdraw consent at any time, for example by unsubscribing from the garden letter;</li>
          <li>receive your data in a format you can take elsewhere.</li>
        </ul>
        <p>
          You can update your details and delete your account yourself under <Link to="/account">My account</Link>.
          For anything else, <ContactLine />. We'll respond as quickly as we can and within the time the law allows.
          If you're unhappy with how we handle your data, you can complain to the{' '}
          <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer">
            Office of the Data Protection Commissioner
          </a>
          .
        </p>
      </Section>

      <Section title="6. How we protect it">
        <p>
          The site only works over an encrypted connection (HTTPS). Passwords are stored hashed, so nobody (including
          us) can read them. Sign-in uses secure cookies that page scripts can't read, accounts lock after repeated
          wrong passwords, and changes to your email or password are confirmed with you by email. Payment details are
          handled by Paystack, not by us. If a breach ever affected your data, we'd tell you and the Data Protection
          Commissioner as the law requires.
        </p>
      </Section>

      <Section title="7. Children">
        <p>
          Our shop and consultations are for adults aged 18 and over. We don't knowingly collect data from children.
          If you think a child has given us their details, <ContactLine /> and we'll delete them.
        </p>
      </Section>

      <Section title="8. Cookies">
        <p>
          We only use cookies that are needed to keep you signed in and keep the site secure. See our{' '}
          <Link to="/cookies">Cookie Policy</Link>.
        </p>
      </Section>

      <Section title="9. Changes">
        <p>
          If we change how we use your data, we'll update this page and the date at the top. For significant changes,
          we'll also tell you by email.
        </p>
      </Section>
    </LegalPage>
  );
}
