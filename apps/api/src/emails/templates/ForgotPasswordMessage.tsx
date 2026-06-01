import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';

type ForgotPasswordMessageProps = {
  customerName: string;
  resetUrl: string;
};

export const ForgotPasswordMessage = ({
  customerName,
  resetUrl,
}: ForgotPasswordMessageProps) => (
  <Html>
    <Head />
    <Preview>Reset your Holy Smokes Engraving password</Preview>
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
          <Heading
            style={{
              color: '#8b5e28',
              fontSize: '24px',
              marginBottom: '8px',
              marginTop: 0,
            }}
          >
            Password Reset Request
          </Heading>
          <Text style={{ color: '#52525b', marginTop: 0 }}>
            Hi {customerName}, we received a request to reset your password.
          </Text>
          <Text style={{ color: '#52525b' }}>
            Click the button below to set a new password. This link will expire in{' '}
            <strong>15 minutes</strong>.
          </Text>

          <Link
            href={`${resetUrl}`}
            style={{
              backgroundColor: '#8b5e28',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '8px',
            }}
          >
            Reset Password
          </Link>

          <Hr style={{ borderColor: '#e8d1a8', marginTop: '32px' }} />

          <Text style={{ color: '#71717a', fontSize: '13px' }}>
            If you didn&apos;t request a password reset, you can safely ignore this
            email. Your password will not change.
          </Text>
          <Text style={{ color: '#71717a', fontSize: '13px' }}>
            If the button above doesn&apos;t work, copy and paste this link into your
            browser:
          </Text>
          <Text style={{ color: '#8b5e28', fontSize: '12px', wordBreak: 'break-all' }}>
            {resetUrl}
          </Text>
        </Section>

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

export default ForgotPasswordMessage;