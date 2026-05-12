import posthog from "posthog-js";

type EventProperties = Record<string, string | number | boolean | undefined>;

function track(event: string, properties?: EventProperties) {
 posthog.capture(event, properties)
}

export const analytics = {
  productViewed: (productId: string, name: string, price: number) =>
    track('product_viewed', { productId, name, price }),

  addedToCart: (productId: string, name: string, price: number) =>
    track('added_to_cart', { productId, name, price }),

  checkoutStarted: (total: number, itemCount: number) =>
    track('checkout_started', { total, itemCount }),

  orderCompleted: (total: number) => track('order_completed', { total }),
};
