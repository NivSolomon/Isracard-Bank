import React, { useEffect, useState } from "react";
import { getAllCreditCards } from "../services/CreditCardsService";
import CreditCardList from "../components/CreditCardList";
import { IBank, ICreditCard } from "../types";
import { getAllBanks } from "../services/BankService";
import SearchBox from "../components/SearchBox";

const Home: React.FC = () => {
  const [banks, setBanks] = useState<IBank[]>([]);
  const [creditCards, setCreditCards] = useState<ICreditCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const banksData = await getAllBanks();
        setBanks(banksData);
        setLoading(false);
      } catch (err: unknown) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        const cardsData = await getAllCreditCards();
        setCreditCards(cardsData);
      } catch (err: unknown) {
        setError(err.message);
      }
    };

    fetchCreditCards();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <SearchBox banks={banks} setCreditCards={setCreditCards} />
      <CreditCardList banks={banks} creditCards={creditCards} />
    </div>
  );
};

export default Home;
