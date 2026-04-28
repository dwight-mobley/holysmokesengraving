import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from '@/components/ui';
import '../app/globals.css';

const meta: Meta<typeof Card> = {
    title: 'Component/Card',
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
    },
    parameters: {
        docs: {
            component: { story: "A container component that applies consistent padding and shadow. Used to group related content and create visual hierarchy." }
        }
    }
};

export default meta;
type Story = StoryObj<typeof Card>

export const Default: Story = {
    args: {
        children: 'Default Card',
    },
    parameters: {
        docs: {
            description: { story: "Basic card with default styling." }
        }
    }
}

export const SmallShadow: Story = {
    args: {
        children: 'Small Shadow',
        shadow: 'sm'
    },
    parameters: {
        docs: {
            description: { story: "Applies a subtle shadow for slight elevation." }
        }
    }
}

export const MediumShadow: Story = {
    args: {
        children: 'Medium Shadow',
        shadow: 'md'
    },
    parameters: {
        docs: {
            description: { story: "Applies a moderate shadow for noticeable elevation." }
        }
    }

}

export const LargeShadow: Story = {
    args: {
        children: 'Large Shadow',
        shadow: 'lg'
    },
    parameters: {
        docs: {
            description: { story: "Applies a strong shadow for significant elevation." }
        }
    }
}

export const SmallPadding: Story = {
    args: {
        children: 'Small Padding',
        padding: 'sm'
    },
    parameters: {
        docs: {
            description: { story: "Applies small padding to the card content." }
        }
    }
}

export const MediumPadding: Story = {
    args: {
        children: 'Medium Padding',
        padding: 'md'
    },
    parameters: {
        docs: {
            description: { story: "Applies medium padding to the card content." }
        }
    }
}

export const LargePadding: Story = {
    args: {
        children: 'Large Padding',
        padding: 'lg'
    },
    parameters: {
        docs: {
            description: { story: "Applies large padding to the card content." }
        }
    }
}