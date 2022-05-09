export interface Payment {
  id?: string;
  title: string;
  description: string;
  image: string;
  active: boolean;
  amount?: number;
  mode: 'UPI' | 'BANK' | 'PAGE';
  upi?: PaymentUPI | null;
  bank?: PaymentBank | null;
  page?: PaymentPage | null;
  createdAt: string | Date;
  createdBy: string;
}

export interface PaymentUPI {
  upiId: string;
  qrCodeImage: string;
}

export interface PaymentBank {
  bankName: string;
  branchName: string;
  IFSC: string;
  accountNumber: string;
  holderName: string;
}

export interface PaymentPage {
  providerName: string;
  url: string;
}
