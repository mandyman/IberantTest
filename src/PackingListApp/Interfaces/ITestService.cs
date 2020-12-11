using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Interfaces
{
    public interface ITestService : IGenericService<TestModel>
    {
        TestModel GetFromObjectTransferModel(NewTestModel model);
    }
}
