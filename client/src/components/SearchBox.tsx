import React, { useState, useEffect } from 'react';
import { IBank, ICreditCard } from '../types';
import { filterCreditCards } from '../services/CreditCardsService';

interface SearchBarProps {
  banks: IBank[];
  setCreditCards: (cards: ICreditCard[]) => void;
}

const SearchBox: React.FC<SearchBarProps> = ({ banks, setCreditCards }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [cardStatus, setCardStatus] = useState('all');

  useEffect(() => {
    handleSearch();
  }, [selectedBank, cardStatus]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleBankChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBank(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCardStatus(event.target.value);
  };

  const handleSearch = async () => {
    try {
      let statusParam: boolean | undefined = undefined;

      if (cardStatus === 'active' || cardStatus === 'blocked') {
        statusParam = cardStatus === 'blocked';
      }

      const cards = await filterCreditCards(searchTerm, selectedBank, statusParam);
      setCreditCards(cards);
    } catch (error) {
      console.error("An error occurred while searching for credit cards:", error);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center">
      <div className="container mx-auto bg-indigo-500 rounded-lg p-14">
        <form>
          <h1 className="text-center font-bold text-white text-4xl mb-6">Look for credit cards!</h1>
          <div className="sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between">
            <input
              className="text-base text-gray-400 flex-grow outline-none px-2"
              type="text"
              placeholder="Looking for a Specific Credit Card?"
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            <div className="flex items-center px-2 rounded-lg space-x-4 mx-auto">
              <select
                id="bankSelection"
                className="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                value={selectedBank}
                onChange={handleBankChange}
              >
                <option value="">All banks</option>
                {banks.map((bank, index) => (
                  <option key={index} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
              <select
                id="statusSelection"
                className="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
                value={cardStatus}
                onChange={handleStatusChange}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <button
                type="button"
                className="bg-indigo-500 text-white text-base rounded-lg px-4 py-2 font-thin"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;
