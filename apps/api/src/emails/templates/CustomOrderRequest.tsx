import {
  Body, Container, Head, Heading, Hr, Html,
  Img, Preview, Section, Text,
} from '@react-email/components';
import React from 'react';

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  itemType: string;
  description: string;
  quantity: number;
  deadline?: string;
  referenceImageUrl?: string;
  additionalNotes?: string;
};

export const CustomOrderRequestEmail = (props: Props) => (
  <Html>
    <Head />
    <Preview>New Custom Order Request from {props.firstName} {props.lastName}</Preview>
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
          <Heading style={{ color: '#6e4720', fontSize: '20px' }}>New Custom Order Request</Heading>
          <Hr />
          <Heading as="h2" style={{ fontSize: '14px', color: '#6e4720', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</Heading>
          <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}>{props.firstName} {props.lastName}</Text>
          <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}>{props.email}</Text>
          {props.phone && <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}>{props.phone}</Text>}
          <Hr />
          <Heading as="h2" style={{ fontSize: '14px', color: '#6e4720', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Request Details</Heading>
          <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}><strong>Item Type:</strong> {props.itemType}</Text>
          <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}><strong>Quantity:</strong> {props.quantity}</Text>
          {props.deadline && <Text style={{ color: '#3f3f46', fontSize: '14px', margin: '4px 0' }}><strong>Deadline:</strong> {props.deadline}</Text>}
          <Hr />
          <Heading as="h2" style={{ fontSize: '14px', color: '#6e4720', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</Heading>
          <Text style={{ color: '#3f3f46', fontSize: '14px', lineHeight: '1.6' }}>{props.description}</Text>
          {props.additionalNotes && (
            <>
              <Hr />
              <Heading as="h2" style={{ fontSize: '14px', color: '#6e4720', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Additional Notes</Heading>
              <Text style={{ color: '#3f3f46', fontSize: '14px', lineHeight: '1.6' }}>{props.additionalNotes}</Text>
            </>
          )}
          {props.referenceImageUrl && (
            <>
              <Hr />
              <Heading as="h2" style={{ fontSize: '14px', color: '#6e4720', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference Image</Heading>
              <Img src={props.referenceImageUrl} alt="Reference" width="400" style={{ borderRadius: '4px' }} />
            </>
          )}
        </Section>
      </Container>
    </Body>
  </Html>
);