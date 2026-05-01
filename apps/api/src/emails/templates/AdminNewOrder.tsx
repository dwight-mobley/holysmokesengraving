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

type AdminOrderItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

type AdminOrderNotificationProps = {
  customerName: string;
  orderId: string;
  items: AdminOrderItem[];
  shippingAddress: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
};

export const AdminOrderNotification = ({
  customerName,
  orderId,
  items,
  shippingAddress,
}: AdminOrderNotificationProps) => (
  <Html>
    <Preview>New Holy Smokes Engraving Order: {orderId}</Preview>
    <Head/>
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
        <Heading style={{ color: '#71717a', fontSize: '16px' }}>
          Order ID: <strong style={{ color: '#3f3f46' }}>{orderId}</strong>
        </Heading>
        <Hr />

        {/* Line Items */}
        <Section>
          <Heading
            as="h2"
            style={{
              fontSize: '15px',
              color: '#6e4720',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Order Summary
          </Heading>
          {items.map((item, i) => (
            <Row key={i} style={{ marginBottom: '8px' }}>
              <Column style={{ color: '#3f3f46', fontSize: '14px' }}>
                {item.name} × {item.quantity}
              </Column>
              <Column
                style={{
                  textAlign: 'right',
                  color: '#3f3f46',
                  fontSize: '14px',
                }}
              >
                {formatMoney(item.total)}
              </Column>
            </Row>
          ))}
        </Section>

        {/* Shipping Address */}
        <Section>
          <Heading
            as="h2"
            style={{
              fontSize: '15px',
              color: '#6e4720',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Shipping To
          </Heading>
          <Text style={{ color: '#52525b', fontSize: '14px', margin: 0 }}>
            {customerName}
            <br />
            {shippingAddress.street}
            <br />
            {shippingAddress.city}, {shippingAddress.state}{' '}
            {shippingAddress.zip}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
