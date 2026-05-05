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

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  subject?: string;
  message: string;
};

export const ContactMessageEmail = ({ firstName, lastName, email, subject, message }: Props) => (
  <Html>
    <Head />
    <Preview>New message from {firstName} {lastName}</Preview>
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
          <Heading style={{ color: '#6e4720', fontSize: '20px' }}>New Contact Form Message</Heading>
          <Hr />
          <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}>
            <strong>From:</strong> {firstName} {lastName}
          </Text>
          <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}>
            <strong>Email:</strong> {email}
          </Text>
          <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}>
            <strong>Subject:</strong> {subject ?? 'General Inquiry'}
          </Text>
          <Hr />
          <Text style={{ color: '#3f3f46', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {message}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);