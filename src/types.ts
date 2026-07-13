declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: 'PSE' | 'Nequi' | 'Wompi' | 'Bold' | 'Efipay' | 'WhatsApp' | 'Tarjeta';
  paymentDetails: {
    transactionId?: string;
    receiptUrl?: string;
    extraMessage?: string;
    wompiTransactionId?: string;
  };
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  metaTracking?: {
    fbp?: string;
    fbc?: string;
    clientIp?: string;
    userAgent?: string;
  };
  shippingStatus?: 'PENDING' | 'SHIPPED';
  expectedShipDate?: string;
  shippedAt?: string;
  shippingEvidenceUrl?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface AdminSession {
  email: string;
  isAuthenticated: boolean;
}
