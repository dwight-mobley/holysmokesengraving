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
} from '@react-email/components';
import React from 'react';

import { formatMoney } from '@hse/shared';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;  // in cents
  total: number;  // in cents
};

type OrderConfirmationProps = {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;   // in cents
  total: number;      // in cents (includes shipping + tax)
  shippingAddress: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
};

export const OrderConfirmation = ({
  customerName,
  orderId,
  items,
  subtotal,
  total,
  shippingAddress,
}: OrderConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Your Holy Smokes Engraving order is confirmed!</Preview>
    <Body style={{ backgroundColor: '#fdf8f0', fontFamily: 'sans-serif' }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>

        {/* Logo Banner */}
        <Section style={{ backgroundColor: '#2c1d0e', padding: '24px 32px', textAlign: 'center' }}>
          <Img
            src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/logo_banner_blogiz.png"
            alt="Holy Smokes Engraving"
            width="240"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </Section>

        {/* Body */}
        <Section style={{ padding: '32px' }}>

          {/* Header */}
          <Heading style={{ color: '#8b5e28', fontSize: '24px', marginBottom: '8px', marginTop: 0 }}>
            Order Confirmed!
          </Heading>
          <Text style={{ color: '#52525b', marginTop: 0 }}>
            Hi {customerName}, thank you for your order. We&apos;re getting started on your custom engraving right away.
          </Text>

          <Text style={{ color: '#71717a', fontSize: '13px' }}>
            Order ID: <strong style={{ color: '#3f3f46' }}>{orderId}</strong>
          </Text>

          <Hr style={{ borderColor: '#e8d1a8' }} />

          {/* Line Items */}
          <Section>
            <Heading as="h2" style={{ fontSize: '15px', color: '#6e4720', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Summary</Heading>
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: '8px' }}>
                <Column style={{ color: '#3f3f46', fontSize: '14px' }}>
                  {item.name} × {item.quantity}
                </Column>
                <Column style={{ textAlign: 'right', color: '#3f3f46', fontSize: '14px' }}>
                  {formatMoney(item.total)}
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: '#e8d1a8' }} />

          {/* Totals */}
          <Section>
            <Row style={{ marginBottom: '4px' }}>
              <Column style={{ color: '#71717a', fontSize: '14px' }}>Subtotal</Column>
              <Column style={{ textAlign: 'right', color: '#71717a', fontSize: '14px' }}>{formatMoney(subtotal)}</Column>
            </Row>
            <Row>
              <Column style={{ color: '#71717a', fontSize: '14px' }}>Shipping + Tax</Column>
              <Column style={{ textAlign: 'right', color: '#71717a', fontSize: '14px' }}>{formatMoney(total - subtotal)}</Column>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Column style={{ fontWeight: 'bold', fontSize: '16px', color: '#2c1d0e' }}>Total</Column>
              <Column style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#2c1d0e' }}>{formatMoney(total)}</Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#e8d1a8' }} />

          {/* Shipping Address */}
          <Section>
            <Heading as="h2" style={{ fontSize: '15px', color: '#6e4720', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipping To</Heading>
            <Text style={{ color: '#52525b', fontSize: '14px', margin: 0 }}>
              {shippingAddress.street}<br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
            </Text>
          </Section>

        </Section>

        {/* Footer */}
        <Section style={{ backgroundColor: '#f5ead6', padding: '16px 32px', textAlign: 'center' }}>
          <Text style={{ color: '#8b5e28', fontSize: '12px', margin: 0 }}>
            Holy Smokes Engraving · Questions? Reply to this email.
          </Text>
        </Section>

      </Container>
    </Body>
  </Html>
);

export default OrderConfirmation;