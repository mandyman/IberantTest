using Microsoft.EntityFrameworkCore;
using PackingListApp.DTO;
using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Services
{
    public class UserManagerService: IUserManagerService
    {
        private readonly TestContext _context;

        public UserManagerService(TestContext context)
        {
            _context = context;
        }

        public async Task<int> AddUserAsync(NewUserModel user)
        {
            var newUser = new User {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Address = user.Address,
                AdminType = user.AdminType,
                IsAdmin = user.IsAdmin,
                Description = user.Description
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser.Id;
        }

        public async Task<User> GetAsync(int id)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.AsNoTracking().ToListAsync();
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public bool UserExist(int id)
        {
            return _context.Users.Any(u => u.Id == id);
        }

        public async Task DeleteAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
