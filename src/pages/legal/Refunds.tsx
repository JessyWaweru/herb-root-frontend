import { ContactLine, LegalPage, Section } from '../../components/legal/LegalPage';

export function Refunds() {
  return (
    <LegalPage
      title="Refund Policy"
      intro={
        <p>
          We want every order to arrive right. This policy explains what happens if it doesn't, and how refunds work
          for consultations. It doesn't affect your rights under Kenyan law.
        </p>
      }
    >
      <Section title="Products: faulty, damaged, wrong or missing items">
        <p>
          If an item arrives damaged, faulty, past its best-before date, or isn't what you ordered, or if something is
          missing, we'll replace it or give you a full refund for that item, including any delivery fee you paid for
          it. You don't pay to send it back.
        </p>
        <p>
          Please tell us within <strong>7 days of delivery</strong> so we can sort it out quickly: <ContactLine />, with
          your order number and a photo of the problem.
        </p>
      </Section>

      <Section title="Products: change of mind">
        <p>
          Because our products are consumable herbal remedies, we can't take back items you've simply changed your mind
          about, for safety and hygiene reasons.
        </p>
      </Section>

      <Section title="Cancelling an order">
        <p>
          If you need to cancel a paid order, contact us as soon as possible. If it hasn't been handed to a rider,
          agent or courier yet, we'll cancel it and refund you in full. If we can't deliver your order, or it hasn't
          arrived within 30 days, you can cancel it for a full refund.
        </p>
      </Section>

      <Section title="Consultations">
        <ul className="bullets">
          <li>Consultation fees aren't refundable once the booking is paid.</li>
          <li>
            You can <strong>reschedule once, free of charge</strong>, if you ask at least 24 hours before your
            session.
          </li>
          <li>Missed sessions, or changes asked for less than 24 hours before, can't be refunded or moved.</li>
          <li>
            If the expert cancels or can't attend, you choose: a new time, or a <strong>full refund</strong>.
          </li>
        </ul>
      </Section>

      <Section title="How refunds are paid">
        <p>
          Once we approve a refund, we pay it within <strong>7 working days</strong>, back to the card or M-Pesa
          account you paid with, through Paystack. Your bank or mobile money provider may take a few extra days to
          show it.
        </p>
      </Section>
    </LegalPage>
  );
}
