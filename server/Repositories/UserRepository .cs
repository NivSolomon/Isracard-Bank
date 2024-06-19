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
    public class UserRepository : IUserRepository
    {
        private readonly string _filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Users.json");
        private List<AppUser> _users;

        public UserRepository()
        {
            LoadUsersFromJson();
        }

        private void LoadUsersFromJson()
        {
            try
            {
                if (!File.Exists(_filePath))
                {
                    throw new FileNotFoundException("The users.json file could not be found.", _filePath);
                }

                var json = File.ReadAllText(_filePath);
                _users = JsonSerializer.Deserialize<UserData>(json)?.Users.ToList() ?? new List<AppUser>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading users from JSON: {ex.Message}");
                _users = new List<AppUser>();
            }
        }

        public Task<IEnumerable<AppUser>> GetAllAsync()
        {
            return Task.FromResult((IEnumerable<AppUser>)_users);
        }

        public Task<AppUser> GetByIdAsync(string id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            return Task.FromResult(user);
        }

        public Task<AppUser> FindByUsernameAsync(string username)
        {
            var user = _users.FirstOrDefault(u => u.Username == username);
            return Task.FromResult(user);
        }

        public Task<AppUser> FindByEmailAsync(string email)
        {
            var user = _users.FirstOrDefault(u => u.Email == email);
            return Task.FromResult(user);
        }

        public Task CreateUserAsync(AppUser user)
        {
            user.Id = Guid.NewGuid().ToString(); 
            _users.Add(user);
            SaveChangesToJson();
            return Task.CompletedTask;
        }

        public Task UpdatePasswordAsync(string userId, string newPassword)
        {
            var user = _users.FirstOrDefault(u => u.Id == userId);
            if (user != null)
            {
                user.PasswordHash = newPassword;
                SaveChangesToJson();
            }
            return Task.CompletedTask;
        }

        private void SaveChangesToJson()
        {
            try
            {
                var jsonData = new UserData { Users = _users };
                var options = new JsonSerializerOptions { WriteIndented = true };
                var jsonString = JsonSerializer.Serialize(jsonData, options);
                File.WriteAllText(_filePath, jsonString);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving users to JSON: {ex.Message}");
            }
        }

        private class UserData
        {
            public List<AppUser> Users { get; set; }
        }
    }
}
