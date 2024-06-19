export interface IBank {
  code: string;
  name: string;
  description: string;
}

export interface ICreditCard {
  id: string;
  cardNumber: string;
  cardIssueDate: Date;
  cardPicture: string;
  isCardBlocked: boolean;
  isDigitalCard: boolean;
  creditLimit: number;
  bankCode: string;
}

export interface CreditLimitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    requestedFrameAmount: number;
    occupation: string;
    averageMonthlyIncome: number;
  }) => void;
  card: ICreditCard;
}

export interface FormValues {
  requestedFrameAmount: number;
  occupation: string;
  averageMonthlyIncome: number;
}

export interface CreditCardListProps {
  banks: IBank[];
  creditCards: ICreditCard[];
}

export type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: ()=> void;
};

export interface CreditLimitFormProps {
  open: boolean;
  onClose: () => void;
  card: ICreditCard;
}

export interface FormValues {
  requestedFrameAmount: number;
  occupation: string;
  averageMonthlyIncome: number;
  cardId: string; // Include cardId in FormValues
}

export interface SearchBarProps {
  banks: IBank[];
  setCreditCards: (cards: ICreditCard[]) => void;
}

export type SignInFormData = {
  email: string;
  password: string;
};