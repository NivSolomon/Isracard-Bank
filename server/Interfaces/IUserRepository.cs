using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;

namespace server.Interfaces
{
  public interface IUserRepository
    {
        Task<AppUser> FindByUsernameAsync(string username);
        Task<AppUser> FindByEmailAsync(string email);
        Task<AppUser> GetByIdAsync(string userId);
        Task CreateUserAsync(AppUser user);
        Task UpdatePasswordAsync(string userId, string newPassword);
    }
}