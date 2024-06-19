using Microsoft.Extensions.Caching.Memory;
using server.Interfaces;
using server.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace server.Repositories
{
    public class BankRepository : IBankRepository
    {
        private readonly IMemoryCache _cache;
        private readonly string _filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Banks.json");
        private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(20);

        public BankRepository(IMemoryCache memoryCache)
        {
            _cache = memoryCache;
            LoadBanksFromJsonAsync().Wait(); // Consider the impact of Wait() in constructor
        }

        private async Task<List<Bank>> LoadBanksFromJsonAsync()
        {
            try
            {
                if (!File.Exists(_filePath))
                {
                    throw new FileNotFoundException("The banks.json file could not be found.", _filePath);
                }

                var json = await File.ReadAllTextAsync(_filePath);
                var banks = JsonSerializer.Deserialize<List<Bank>>(json);

                if (banks != null)
                {
                    _cache.Set("banks", banks, _cacheDuration);
                    return banks;
                }
                else
                {
                    throw new Exception("Failed to deserialize banks from JSON.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading banks from JSON: {ex.Message}");
                _cache.Set("banks", new List<Bank>(), _cacheDuration);
                return new List<Bank>();
            }
        }

        public async Task<IEnumerable<Bank>> GetBanksAsync()
        {
            try
            {
                if (!_cache.TryGetValue("banks", out List<Bank> banks))
                {
                    banks = await LoadBanksFromJsonAsync();
                }

                return banks;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetBanksAsync: {ex.Message}");
                return new List<Bank>();
            }
        }

        public async Task<Bank> GetBankByCodeAsync(string code)
        {
            try
            {
                if (_cache.TryGetValue("banks", out List<Bank> banks))
                {
                    var bank = banks.FirstOrDefault(b => b.Code == code);
                    return bank;
                }
                else
                {
                    var loadedBanks = await LoadBanksFromJsonAsync();
                    var bank = loadedBanks.FirstOrDefault(b => b.Code == code);
                    return bank;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetBankByCodeAsync: {ex.Message}");
                return null; // Handle null appropriately in higher layers
            }
        }
    }
}
