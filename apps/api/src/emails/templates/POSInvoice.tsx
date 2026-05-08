import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Column,
  Section,
  Text,
  Link,
} from '@react-email/components';
import React from 'react';
import { formatMoney } from '@hse/shared';

type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

type POSInvoiceProps = {
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;   // 0 = tax-exempt
  total: number;
  paymentUrl: string;
  notes?: string;
  mailingAddress?: string;
};

export const POSInvoice = ({
  customerName,
  items,
  subtotal,
  taxAmount,
  total,
  paymentUrl,
  notes,
  mailingAddress,
}: POSInvoiceProps) => (
  <Html>
    <Head />
    <Preview>Your Holy Smokes Engraving invoice is ready — pay online in seconds!</Preview>
    <Body style={{ backgroundColor: '#fdf8f0', fontFamily: 'sans-serif' }}>
      <Container
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {/* Logo Banner */}
        <Section style={{ backgroundColor: '#2c1d0e', padding: '24px 32px', textAlign: 'center' }}>
          <Img
            src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/logo_banner_blogiz.png"
            alt="Holy Smokes Engraving"
            width="240"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </Section>

        <Section style={{ padding: '32px' }}>
          <Heading style={{ color: '#8b5e28', fontSize: '24px', marginTop: 0, marginBottom: '8px' }}>
            Your Invoice
          </Heading>
          <Text style={{ color: '#52525b', marginTop: 0 }}>
            Hi {customerName}, here is your invoice from Holy Smokes Engraving.
            You can pay securely online using the button below.
          </Text>

          <Hr style={{ borderColor: '#e8d1a8' }} />

          {/* Line items */}
          <Heading
            as="h2"
            style={{ fontSize: '15px', color: '#6e4720', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Order Summary
          </Heading>
          {items.map((item, i) => (
            <Row key={i} style={{ marginBottom: '8px' }}>
              <Column style={{ color: '#3f3f46', fontSize: '14px' }}>
                {item.name} × {item.quantity}
              </Column>
              <Column style={{ textAlign: 'right', color: '#3f3f46', fontSize: '14px', fontWeight: 'bold' }}>
                {formatMoney(item.total)}
              </Column>
            </Row>
          ))}

          <Hr style={{ borderColor: '#e8d1a8' }} />

          {/* Totals */}
          <Row style={{ marginBottom: '4px' }}>
            <Column style={{ color: '#71717a', fontSize: '14px' }}>Subtotal</Column>
            <Column style={{ textAlign: 'right', fontSize: '14px' }}>{formatMoney(subtotal)}</Column>
          </Row>
          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ color: '#71717a', fontSize: '14px' }}>
              {taxAmount === 0 ? 'Tax (Exempt)' : 'Sales Tax (GA)'}
            </Column>
            <Column style={{ textAlign: 'right', fontSize: '14px' }}>
              {taxAmount === 0 ? '—' : formatMoney(taxAmount)}
            </Column>
          </Row>
          <Row>
            <Column style={{ color: '#2c1d0e', fontSize: '16px', fontWeight: 'bold' }}>Total</Column>
            <Column style={{ textAlign: 'right', fontSize: '16px', fontWeight: 'bold', color: '#8b5e28' }}>
              {formatMoney(total)}
            </Column>
          </Row>

          {notes && (
            <>
              <Hr style={{ borderColor: '#e8d1a8' }} />
              <Text style={{ color: '#52525b', fontSize: '13px' }}>
                <strong>Notes:</strong> {notes}
              </Text>
            </>
          )}

          <Hr style={{ borderColor: '#e8d1a8' }} />

          {/* Pay Now CTA */}
          <Section style={{ textAlign: 'center', padding: '16px 0' }}>
            <Link
              href={paymentUrl}
              style={{
                backgroundColor: '#8b5e28',
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'inline-block',
              }}
            >
              Pay {formatMoney(total)} Now
            </Link>
          </Section>
          <Text style={{ color: '#71717a', fontSize: '12px', textAlign: 'center' }}>
            This link expires in 7 days. Reply to this email with any questions.
          </Text>

          {/* Optional check-payment instructions */}
          {mailingAddress && (
            <>
              <Hr style={{ borderColor: '#e8d1a8' }} />
              <Text style={{ color: '#52525b', fontSize: '13px' }}>
                <strong>Prefer to pay by check?</strong>
                {'\n'}Make payable to <em>Holy Smokes Engraving</em> and mail to:
                {'\n'}{mailingAddress}
              </Text>
            </>
          )}
        </Section>
      </Container>
    </Body>
  </Html>
);

export default POSInvoice;