import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';

type OrderShippedProps = {
  customerName: string;
  orderId: string;
  trackingNumber: string;
};

export const OrderShipped = ({
  customerName,
  orderId,
  trackingNumber,
}: OrderShippedProps) => (
  <Html>
    <Head />
    <Preview>Your Holy Smokes Engraving order has shipped!</Preview>
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
        <Section
          style={{
            backgroundColor: '#2c1d0e',
            padding: '24px 32px',
            textAlign: 'center',
          }}
        >
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
          <Heading
            style={{
              color: '#8b5e28',
              fontSize: '24px',
              marginBottom: '8px',
              marginTop: 0,
            }}
          >
            Order Has Shipped!
          </Heading>
          <Text style={{ color: '#52525b', marginTop: 0 }}>
            Hi {customerName}, we have good news! Your order {orderId} has
            shipped.
          </Text>

          <Text style={{ color: '#71717a', fontSize: '13px' }}>
            Tracking Number:{' '}
            <strong style={{ color: '#3f3f46' }}>{trackingNumber}</strong>
          </Text>
        </Section>

        <Hr style={{ borderColor: '#e8d1a8' }} />

        {/* Footer */}
        <Section
          style={{
            backgroundColor: '#f5ead6',
            padding: '16px 32px',
            textAlign: 'center',
          }}
        >
          <Text style={{ color: '#8b5e28', fontSize: '12px', margin: 0 }}>
            Holy Smokes Engraving · Questions? Reply to this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderShipped;
