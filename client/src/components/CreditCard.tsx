import React, { useState } from "react";
import { IBank, ICreditCard } from "../types";
import CreditLimitForm from "./CreditLimitForm";
import { FaRegCreditCard } from "react-icons/fa";
import { AiOutlineBank } from "react-icons/ai";

interface CreditCardProps {
  card: ICreditCard;
  banks: IBank[];
}

const CreditCard: React.FC<CreditCardProps> = ({ card, banks }) => {
  const [toggleForm, setToggleForm] = useState(false);

  const openForm = () => {
    setToggleForm(true);
  };

  const closeForm = () => {
    setToggleForm(false);
  };

  const handleSubmit = (formData: {
    requestedFrameAmount: number;
    occupation: string;
    averageMonthlyIncome: number;
  }) => {
    console.log("Form Data Submitted: ", formData);
    // Handle the form submission logic here
    closeForm();
  };

  const getBankName = (bankCode: string): string => {
    const bank = banks.find((bank: IBank) => bank.code === bankCode);
    return bank ? bank.name : "Unknown Bank";
  };

  // Determine border color based on card status
  const borderColor = card.isCardBlocked
    ? "border-red-500"
    : "border-green-500";

  return (
    <div
      className={`border-2 ${borderColor} rounded-lg p-4 mb-4 hover:bg-gray-100 cursor-pointer transition duration-300`}
      onClick={openForm}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FaRegCreditCard className="text-2xl text-gray-500 mr-2" />
          <span className="text-lg font-semibold">{card.cardNumber}</span>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <AiOutlineBank className="text-3xl text-gray-600 mr-2" />
          <div className="text-lg font-semibold">{getBankName(card.bankCode)}</div>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg shadow-md">
        <img
          className="w-full h-auto object-cover"
          src={card.cardPicture}
          alt="Card Image"
        />
      </div>
      <CreditLimitForm
        open={toggleForm}
        onClose={closeForm}
        onSubmit={handleSubmit}
        card={card}
      />
    </div>
  );
};

export default CreditCard;
