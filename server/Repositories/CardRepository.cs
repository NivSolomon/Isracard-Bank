using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using server.Interfaces;
using server.Models;

namespace server.Repositories
{
    public class CardRepository : ICardRepository
    {
        private readonly string _filePath = "Data/CreditCards.json";
        private List<CreditCard> _creditCards;

        public CardRepository()
        {
            LoadCardsFromJsonAsync().Wait(); 
        }

        private async Task LoadCardsFromJsonAsync()
        {
            try
            {
                if (!File.Exists(_filePath))
                {
                    throw new FileNotFoundException("The Cards.json file could not be found.", _filePath);
                }

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    Converters = { new GuidConverter() }
                };

                var json = await File.ReadAllTextAsync(_filePath);
                _creditCards = JsonSerializer.Deserialize<List<CreditCard>>(json, options) ?? new List<CreditCard>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading Credit Cards from JSON: {ex.Message}");
                _creditCards = new List<CreditCard>();
            }
        }

        public async Task<IEnumerable<CreditCard>> GetAllCardsAsync()
        {
            try
            {
                if (_creditCards == null)
                {
                    await LoadCardsFromJsonAsync();
                }
                return _creditCards;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllCardsAsync: {ex.Message}");
                return new List<CreditCard>();
            }
        }

        public async Task<CreditCard> GetCardByIdAsync(Guid id)
        {
            try
            {
                if (_creditCards == null)
                {
                    await LoadCardsFromJsonAsync();
                }

                return _creditCards.FirstOrDefault(card => card.Id == id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetCardByIdAsync: {ex.Message}");
                return null;
            }
        }

        public async Task UpdateCardAsync(CreditCard updatedCard)
        {
            try
            {
                if (_creditCards == null)
                {
                    await LoadCardsFromJsonAsync();
                }

                var existingCard = _creditCards.FirstOrDefault(c => c.Id == updatedCard.Id);

                if (existingCard != null)
                {
                    // Update existing card properties
                    existingCard.CardNumber = updatedCard.CardNumber;
                    existingCard.CardIssueDate = updatedCard.CardIssueDate;
                    existingCard.CardPicture = updatedCard.CardPicture;
                    existingCard.IsCardBlocked = updatedCard.IsCardBlocked;
                    existingCard.IsDigitalCard = updatedCard.IsDigitalCard;
                    existingCard.CreditLimit = updatedCard.CreditLimit;
                    existingCard.BankCode = updatedCard.BankCode;

                    var options = new JsonSerializerOptions
                    {
                        WriteIndented = true,
                        Converters = { new GuidConverter() }
                    };
                    var json = JsonSerializer.Serialize(_creditCards, options);
                    await File.WriteAllTextAsync(_filePath, json);
                }
                else
                {
                    throw new KeyNotFoundException($"Card with ID {updatedCard.Id} not found");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateCardAsync: {ex.Message}");
                throw; // Re-throw the exception for higher-level handling
            }
        }

        public async Task<IEnumerable<CreditCard>> FilterCardsAsync(bool? isBlocked, string? cardNumber, string? bankCode)
        {
            try
            {
                if (_creditCards == null)
                {
                    await LoadCardsFromJsonAsync();
                }

                // Apply filters based on parameters
                var filteredCards = _creditCards.AsQueryable();

                if (isBlocked.HasValue)
                {
                    filteredCards = isBlocked.Value
                        ? filteredCards.Where(card => card.IsCardBlocked)
                        : filteredCards.Where(card => !card.IsCardBlocked);
                }

                if (!string.IsNullOrEmpty(cardNumber))
                {
                    filteredCards = filteredCards.Where(card => card.CardNumber.Contains(cardNumber));
                }

                if (!string.IsNullOrEmpty(bankCode))
                {
                    filteredCards = filteredCards.Where(card => card.BankCode.Equals(bankCode, StringComparison.OrdinalIgnoreCase));
                }

                return filteredCards.ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in FilterCardsAsync: {ex.Message}");
                return new List<CreditCard>();
            }
        }
    }
}
