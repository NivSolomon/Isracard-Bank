using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;

namespace server.Interfaces
{
    public interface IBankRepository
    {
        Task<IEnumerable<Bank>> GetBanksAsync();
        Task<Bank> GetBankByCodeAsync(string code);
    }
}