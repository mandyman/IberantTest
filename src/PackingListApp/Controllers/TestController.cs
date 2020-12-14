using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PackingList.Core.Queries;
using PackingListApp.Interfaces;
using PackingListApp.Models;

namespace PackingListApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        public readonly ITestService _testService;
        public TestController(ITestService testService)
        {
            _testService = testService;
        }
        // GET: api/Test
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<TestModel> options)
        {
            var data = _testService.GetAll();
            return Ok(new QueryResult<TestModel>(data, data.Count()));
        }

        // GET: api/Test/5
        [HttpGet("{id}", Name = "Get")]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(await _testService.GetByIdAsync(id));
        }

        // POST: api/Test
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] NewTestModel value)
        {
            TestModel postValue = _testService.GetFromObjectTransferModel(value);
            TestModel result = await _testService.CreateAsync(postValue);
            return Ok(new CommandHandledResult(true, result.Id.ToString(), result.Id.ToString(), result.Id.ToString()));
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> Put(int id, [FromBody] TestModel item)
        {
            await _testService.UpdateAsync(item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            TestModel item = await _testService.GetByIdAsync(id);
            await _testService.DeleteAsync(item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
