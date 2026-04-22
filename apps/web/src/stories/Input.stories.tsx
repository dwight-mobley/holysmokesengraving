import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from 'storybook/test';
import { Input } from '@/components/ui';
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
    },
    parameters: {
        docs: {
            description: { component: "An input field component that provides consistent styling and behavior." }
        }
    }

};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Default Input'
    },
    parameters: {
        docs: {
            description: { story: "A basic input field with default styling." }
        }
    }
}

export const Small: Story = {
    args: {
        size: 'sm',
        placeholder: 'Small Input'
    },
    parameters: {
        docs: {
            description: { story: "A small input field." }
        }
    }
}

export const Medium: Story = {
    args: {
        size: 'md',
        placeholder: 'Medium Input',
        'aria-label': 'Medium Input'
    },
    parameters: {
        docs: {
            description: { story: "A medium input field, the default size." }
        }
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
        placeholder: 'Large Input'
    },
    parameters: {
        docs: {
            description: { story: "A large input field." }
        }
    }
}

export const Invalid: Story = {
    args: {
        size: 'lg',
        invalid: true,
        placeholder: 'Invalid Input'
    },
    parameters: {
        docs: {
            description: { story: "An invalid input field." }
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('textbox');
        await userEvent.type(input, 'Invalid Input');
        await expect(input).toHaveValue('Invalid Input');
        await expect(input).toHaveAttribute('data-invalid', 'true');
        await expect(input).toHaveAttribute('aria-invalid', 'true');
    }
}