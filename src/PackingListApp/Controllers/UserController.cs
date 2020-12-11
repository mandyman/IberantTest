﻿using System;
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
    public class UserController : ControllerBase
    {
        // Services are used to interact with dbContext
        public readonly IUserServices _userService;
        public UserController(IUserServices userServices)
        {
            _userService = userServices;
        }
        // GET: api/User
        [HttpGet]
        public IActionResult Get(ODataQueryOptions<UserModel> options)
        {
            var list = _userService.GetAll();
            return Ok(new QueryResult<UserModel>(list, list.Count));
        }

        // GET: api/User/5
        [HttpGet("{id}", Name = "Get")]
        public IActionResult Get(int id)
        {
            return Ok(_userService.Get(id));
        }

        // POST: api/User
        [HttpPost]
        public IActionResult Post([FromBody] NewUserModel value)
        {
            var id = _userService.Add(value);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));

        }

        [HttpPut("{id}")]
        public  IActionResult Put(int id, [FromBody] UserModel item)
        {
            _userService.Put(id, item);
            return Ok(new CommandHandledResult(true, id.ToString(), id.ToString(), id.ToString()));
        }
    }
}
