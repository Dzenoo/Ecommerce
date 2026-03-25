type MetaPixelEvent =
  | {
      event: 'ViewContent';
      data: {
        content_ids: string[];
        content_name: string;
        content_type: 'product';
        value: number;
        currency: string;
      };
    }
  | {
      event: 'AddToCart';
      data: {
        content_ids: string[];
        content_name: string;
        content_type: 'product';
        value: number;
        currency: string;
        num_items: number;
      };
    }
  | {
      event: 'InitiateCheckout';
      data: {
        content_ids: string[];
        num_items: number;
        value: number;
        currency: string;
      };
    }
  | {
      event: 'Purchase';
      data: {
        content_ids: string[];
        content_type: 'product';
        num_items: number;
        value: number;
        currency: string;
      };
    };

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function trackMetaPixel({ event, data }: MetaPixelEvent) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, data);
  }
}

export function getPixelCurrency(): string {
  return process.env.NEXT_PUBLIC_CURRENCY || 'USD';
}
