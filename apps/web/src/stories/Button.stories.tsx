import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"], // enables auto-generated docs page
  parameters: {
    docs: {
      description: {
        component:
          "Primary UI action element used throughout the storefront. Supports multiple variants and sizes.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Controls padding and font size",
    },
    disabled: {
      control: "boolean",
      description: "Prevents interaction and applies muted styles",
    },
    onClick: {
      action: "clicked",
      description: "Callback fired on button click",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", size: "md", children: "Add to Cart" },
};

export const Secondary: Story = {
  args: { variant: "secondary", size: "md", children: "View Details" },
};

export const Disabled: Story = {
  args: { variant: "primary", size: "md", children: "Unavailable", disabled: true },
  parameters: {
    docs: {
      description: { story: "Used when a product is out of stock." },
    },
  },
};