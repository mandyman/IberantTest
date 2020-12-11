using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Mvc;
using PackingList.Core.Queries;
using PackingListApp.DTO;
using PackingListApp.Interfaces;
using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Controllers
{
    public class UserController : Controller
    {
        [Route("api/[controller]")]
        [ApiController]
        public class TestController : ControllerBase
        {
            public readonly IUserService _userService;
            public TestController(IUserService userService)
            {
                _userService = userService;
            }
            // GET: api/Test
            [HttpGet]
            public IActionResult Get(ODataQueryOptions<User> options)
            {
                var data = _userService.GetAll();
                return Ok(new QueryResult<User>(data, data.Count()));
            }

            // GET: api/Test/5
            [HttpGet("{id}", Name = "Get")]
            public async Task<IActionResult> Get(int id)
            {
                return Ok(await _userService.GetByIdAsync(id));
            }

            // POST: api/Test
            [HttpPost]
            public async Task<IActionResult> Post([FromBody] NewUserModel value)
            {
                User postValue = _userService.GetFromObjectTransferModel(value);
                User result = await _userService.CreateAsync(postValue);
                return Ok(new CommandHandledResult(true, result.Id.ToString(), result.Id.ToString(), result.Id.ToString()));
            }

            [HttpPut("{id}")]
            public async Task<IActionResult> Put(int id, [FromBody] User item)
            {
                await _userService.UpdateAsync(item);
                return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
            }
        }
    }
}
