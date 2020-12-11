using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Services
{
    public class TestServices : GenericService<TestModel>, ITestService
    {
        private readonly TestContext _context;
        public TestServices(TestContext context):base(context)
        {
            _context = context;
        }
        public TestModel GetFromObjectTransferModel(NewTestModel model)
        {
            return new TestModel
            {
                Title = model.Title,
                Description = model.Description
            };
        }
    }
}
