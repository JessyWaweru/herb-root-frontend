import { Link } from 'react-router-dom';
import { ContactLine, LegalPage, Section } from '../../components/legal/LegalPage';
import { LEGAL } from '../../lib/legal';

export function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro={
        <p>
          These terms apply when you use {LEGAL.website} or buy from us. By creating an account, placing an order or
          booking a consultation you agree to them, so please read them. Nothing here takes away your rights under
          Kenyan law, including the Consumer Protection Act, 2012.
        </p>
      }
    >
      <Section title="1. Who we are">
        <p>
          The site is run by {LEGAL.businessName}, trading as {LEGAL.tradingName}, based in {LEGAL.location}. To reach
          us, <ContactLine />.
        </p>
      </Section>

      <Section title="2. Your account">
        <p>
          You must be 18 or older to create an account, buy or book a consultation. Give accurate details, keep your
          password to yourself, and tell us straight away if you think someone else has used your account. You can
          delete your account at any time under <Link to="/account">My account</Link>.
        </p>
      </Section>

      <Section title="3. Our products and your health">
        <p>
          Our products are herbal remedies based on traditional use. They are <strong>not medicines</strong> and are
          not intended to diagnose, treat, cure or prevent any disease. Product descriptions explain what herbs are
          traditionally used for; they are not medical advice and results vary from person to person.
        </p>
        <ul className="bullets">
          <li>
            Check the ingredient list before use, especially if you have allergies, and stop using a product if it
            disagrees with you.
          </li>
          <li>
            Talk to a doctor before use if you are pregnant or breastfeeding, take any medication, have a medical
            condition, or are buying for a child.
          </li>
          <li>Follow the directions on the label, and keep products out of reach of children.</li>
          <li>Don't stop or replace treatment your doctor has prescribed.</li>
        </ul>
      </Section>

      <Section title="4. Prices, orders and payment">
        <p>
          Prices are in Kenya shillings (KES). The delivery fee is shown before you pay. Your order is confirmed once
          payment through Paystack succeeds, and we email you a confirmation. If an item turns out to be out of stock,
          or a price was clearly shown wrongly, we'll contact you and either fix the order with your agreement or
          cancel it and refund you in full.
        </p>
      </Section>

      <Section title="5. Delivery and pickup">
        <p>
          We deliver by rider within our delivery zones, through pickup agents, or you can collect from us, as offered
          at checkout. Delivery times are estimates. Please give an accurate address and map pin, and keep your phone
          on so the rider can reach you. If we can't deliver after reasonable attempts because of wrong details or
          because nobody was available, we'll contact you to arrange another delivery, which may cost a further fee.
        </p>
      </Section>

      <Section title="6. Returns and refunds">
        <p>
          Our <Link to="/refunds">Refund Policy</Link> explains when you can get a replacement or refund, including
          for consultations.
        </p>
      </Section>

      <Section title="7. Consultations">
        <p>
          Consultations are given by the herbal coaches and medical specialists listed on the site. A herbal coach
          shares guidance on traditional remedies and wellbeing; this is not a medical diagnosis. For diagnosis or
          treatment, book a medical specialist or see your doctor.{' '}
          <strong>In an emergency, go to the nearest hospital or call emergency services; don't wait for a
          consultation.</strong>
        </p>
        <p>
          Your booking is confirmed once paid. Please be available at the agreed time. Rescheduling and refunds are
          covered in the <Link to="/refunds">Refund Policy</Link>.
        </p>
      </Section>

      <Section title="8. Reviews and messages you send">
        <p>
          Reviews must be honest, about your own experience, and must not contain anything unlawful, offensive or
          personal about someone else. We may remove reviews that break these rules. Reviews show your first name and
          last initial.
        </p>
      </Section>

      <Section title="9. Using the site fairly">
        <p>
          Don't misuse the site: no fraud, no attempts to break in or disrupt it, no automated scraping or bulk
          account creation, and no using it to harm others. We may suspend accounts that do.
        </p>
      </Section>

      <Section title="10. Content and copyright">
        <p>
          The site's text, design, logo and our own photos belong to {LEGAL.businessName} or are used with permission.
          Some photos are by other people and used under their licences; they're credited where they appear. Please
          don't copy our content for commercial use without asking.
        </p>
      </Section>

      <Section title="11. Our responsibility to you">
        <p>
          We'll provide our products and services with reasonable care and skill. Nothing in these terms limits our
          responsibility where the law doesn't allow it to be limited. Otherwise, we're not responsible for losses we
          couldn't reasonably have foreseen, or for problems caused by events outside our control, and our
          responsibility for any order is limited to the amount you paid for it.
        </p>
      </Section>

      <Section title="12. Law and disputes">
        <p>
          These terms are governed by the laws of Kenya. If something goes wrong, please contact us first and we'll
          try to put it right. If we can't agree, the courts of Kenya will decide.
        </p>
      </Section>

      <Section title="13. Changes to these terms">
        <p>
          We may update these terms. The version on this page when you place an order or book a consultation is the
          one that applies to it.
        </p>
      </Section>
    </LegalPage>
  );
}
