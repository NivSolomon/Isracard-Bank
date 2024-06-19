using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;

namespace server.Interfaces
{
    public interface IUserService
    {
        Task<string> GenerateJwtTokenAsync(AppUser user);
        bool ValidatePassword(AppUser user, string password);
        Task<string> AuthenticateAsync(string username, string password);
    }
}