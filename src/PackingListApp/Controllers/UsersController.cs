using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PackingList.Core.Queries;
using PackingListApp.DTO;
using PackingListApp.EntityFramework;
using PackingListApp.Interfaces;
using PackingListApp.Models;

namespace PackingListApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserManagerService _userManager;

        public UsersController(IUserManagerService userManager)
        {
            _userManager = userManager;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var all = await _userManager.GetAllAsync();
            return Ok(new QueryResult<User>(all, all.Count()));
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _userManager.GetAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest(new CommandHandledResult(false, id.ToString(), id.ToString(), id.ToString()));
            }
            try
            {
                await _userManager.UpdateUserAsync(user);
                return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_userManager.UserExist(id))
                {
                    return NotFound(new CommandHandledResult(false, id.ToString(), id.ToString(), id.ToString()));
                }
                else
                {
                    throw;
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(NewUserModel user)
        {
            var id = await _userManager.AddUserAsync(user);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userManager.GetAsync(id);

            if (user == null)
            {
                return NotFound(new CommandHandledResult(false, id.ToString(), id.ToString(), id.ToString()));
            }

            await _userManager.DeleteAsync(user);

            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }


    }
}
