import {Meta, StoryObj} from '@storybook/nextjs-vite'
import {Card} from '@/components/ui';
import '../app/globals.css';

const meta: Meta<typeof Card> = {
    title: 'UI/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
        shadow: {
            control: 'select',
            options: ['sm', 'md', 'lg']
        },
        padding: {
            control: 'select',
            options: ['sm', 'md', 'lg']
        }
    }
}

export default meta;
type Story = StoryObj<typeof Card>

export const SmallShadow: Story = {
    args: {
        children: 'Small Shadow',
        shadow: 'sm'
    }
}

export const MediumShadow: Story = {
    args: {
        children: 'Medium Shadow',
        shadow: 'md'
    }
}

export const LargeShadow: Story = {
    args: {
        children: 'Large Shadow',
        shadow: 'lg'
    }
}

export const SmallPadding: Story = {
    args: {
        children: 'Small Padding',
        padding: 'sm'
    }
}

export const MediumPadding: Story = {
    args: {
        children: 'Medium Padding',
        padding: 'md'
    }
}

export const LargePadding: Story = {
    args: {
        children: 'Large Padding',
        padding: 'lg'
    }
}