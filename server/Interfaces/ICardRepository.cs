using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;

namespace server.Interfaces
{
    public interface ICardRepository
    {
        Task<IEnumerable<CreditCard>> GetAllCardsAsync();
        Task<CreditCard> GetCardByIdAsync(Guid id);
        Task UpdateCardAsync(CreditCard card);
        Task<IEnumerable<CreditCard>> FilterCardsAsync(bool? isBlocked, string? cardNumber, string? bankCode);
    }
}