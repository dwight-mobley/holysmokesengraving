import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import { within, userEvent, expect } from 'storybook/test';
import {Input} from '@/components/ui';
import '../app/globals.css'

const meta: Meta<typeof Input> = {
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        invalid: {
            control: 'boolean'
        }
    }
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Small: Story = {
    args: {
        size: 'sm',
        placeholder: 'Small Input'
    }
}

export const Medium: Story = {
    args: {
        size: 'md',
         placeholder: 'Medium Input',
        'aria-label': 'Medium Input'
    },
     play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'Hello World');
    await expect(input).toHaveValue('Hello World');
  },
}

export const Large: Story = {
    args: {
        size: 'lg',
        placeholder: 'large Input'
    }
}

export const Invalid: Story = {
    args: {
        size: 'lg',
        invalid: true,
        placeholder: 'Invalid Input'
    }
}