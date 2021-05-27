using PackingListApp.DTO;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Interfaces
{
    public interface IUserManagerService
    {
        public Task<IEnumerable<User>> GetAllAsync();
        public Task<User> GetAsync(int id);
        public Task<int> AddUserAsync(NewUserModel newUserModel);
        public Task DeleteAsync(User user);
        public Task UpdateUserAsync(User user);

        public bool UserExist(int id);
    }
}
