using PackingListApp.DTO;
using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Services
{
    public class UserServices : GenericService<User>, IUserService
    {
        private readonly TestContext context;

        public UserServices(TestContext context) : base(context)
        {
            this.context = context;
        }

        public User GetFromObjectTransferModel(NewUserModel model)
        {
            return new User
            {
                Name = model.Name,
                LastName = model.LastName,
                Address = model.Address
            };
        }
    }
}
