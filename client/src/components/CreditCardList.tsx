import React from 'react';
import { CreditCardListProps, ICreditCard } from '../types';
import CreditCard from './CreditCard';

const CreditCardList: React.FC<CreditCardListProps> = ({ banks, creditCards }) => {
  return (
    <div>
      {creditCards.length === 0 ? (
        <h2 className="text-xl font-bold text-center mt-6">
          There are no credit cards that match your search results.
        </h2>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-6">
          {creditCards.map((card: ICreditCard, index: number) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4">
              <CreditCard card={card} banks={banks} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreditCardList;
