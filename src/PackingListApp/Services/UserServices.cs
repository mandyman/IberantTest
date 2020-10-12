using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Services
{
    public class UserServices : IUserServices
    {
        private readonly TestContext _context;
        public UserServices(TestContext context)
        {
            _context = context;
        }

        public int Add(NewUserModel usermodel)
        {
            var newuser = new User()
            {
                Name = usermodel.Name,
                LastName = usermodel.LastName,
                Address = usermodel.Address
            };
            _context.Users.Add(newuser
            );
            _context.SaveChanges();
            return newuser.Id;
        }

        public User Get(int id)
        {
            return _context.Users.FirstOrDefault(t => t.Id == id);
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public int Put(int id, User item)
        {
            var itemput = _context.Users.FirstOrDefault(t => t.Id == id);
            itemput.Name = item.Name;
            itemput.LastName = item.LastName;
            itemput.Address = item.Address;
            _context.SaveChanges();
            return id;

        }
    }
}
