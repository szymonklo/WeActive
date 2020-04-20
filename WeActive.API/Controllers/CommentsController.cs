using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using WeActive.API.Data;
using WeActive.API.Dtos;
using WeActive.API.Helpers;
using WeActive.API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WeActive.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly IRepository _repo;
        private readonly IMapper _mapper;
        public CommentsController(IRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }

        [HttpGet("{id}", Name = "GetComment")]
        public async Task<IActionResult> GetComment(int id)
        {
            // if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();

            var commentFromRepo = await _repo.GetComment(id);

            if (commentFromRepo == null)
                return NotFound();

            return Ok(commentFromRepo);
        }

        
        [HttpGet("activity/{activityId}", Name = "GetComments")]
        public async Task<IActionResult> GetComments(int activityId)
        {
            // if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();

            var commentsFromRepo = await _repo.GetComments(activityId);

            // var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagerFromRepo);

            return Ok(commentsFromRepo);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment(int userId, Comment comment)
        {

            var sender = await _repo.GetUser(userId);

            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            comment.SenderId = userId;

            var activity = await _repo.GetActivity(comment.ActivityId);

            if (activity == null)
                return BadRequest("Could not find activity");

            // var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(comment);

            if (await _repo.SaveAll())
            {
                // var messageToReturn = _mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetComment",
                    new {id = comment.Id}, comment);
            }

            throw new Exception("Creating the comment filed on save");
        }
    }
}