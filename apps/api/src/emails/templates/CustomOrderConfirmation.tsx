import {
  Body, Container, Head, Heading, Hr, Html,
  Img, Preview, Section, Text,
} from '@react-email/components';
import React from 'react';

type Props = { firstName: string; itemType: string; description: string };

export const CustomOrderConfirmationEmail = ({ firstName, itemType, description }: Props) => (
  <Html>
    <Head />
    <Preview>We received your custom order request — Holy Smokes Engraving</Preview>
    <Body style={{ backgroundColor: '#fdf8f0', fontFamily: 'sans-serif' }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <Section style={{ backgroundColor: '#2c1d0e', padding: '24px 32px', textAlign: 'center' }}>
          <Img
            src="https://res.cloudinary.com/dwf7x3rjv/image/upload/v1776687837/logo_banner_blogiz.png"
            alt="Holy Smokes Engraving"
            width="240"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </Section>
        <Section style={{ padding: '24px 32px' }}>
          <Heading style={{ color: '#6e4720' }}>We got your request, {firstName}!</Heading>
          <Text style={{ color: '#3f3f46', fontSize: '15px', lineHeight: '1.6' }}>
            Thank you for reaching out to Holy Smokes Engraving. We&apos;ve received your
            custom order request and will get back to you within 1–2 business days with
            a quote and any follow-up questions.
          </Text>
          <Hr />
          <Heading as="h2" style={{ fontSize: '14px', color: '#6e4720', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Request Summary</Heading>
          <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}><strong>Item Type:</strong> {itemType}</Text>
          <Text style={{ color: '#3f3f46', fontSize: '14px', lineHeight: '1.6' }}><strong>Description:</strong> {description}</Text>
          <Hr />
          <Text style={{ color: '#71717a', fontSize: '13px' }}>
            Questions? Reply to this email or contact us at dwight@holysmokesengraving.com.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);