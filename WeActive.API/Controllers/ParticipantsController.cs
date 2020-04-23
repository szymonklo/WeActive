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
    [Route("api/activities/{activityId}/[controller]")]
    [ApiController]
    public class ParticipantsController : ControllerBase
    {
        private readonly IRepository _repo;
        private readonly IMapper _mapper;
        public ParticipantsController(IRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }

        [HttpGet("number", Name = "GetParticipantsNumber")]
        public async Task<IActionResult> GetParticipantsNumber(int activityId)
        {
            Console.WriteLine(123);
            var participantsNumber = await _repo.GetParticipantsNumber(activityId);

            return Ok(participantsNumber);
        }

        [HttpGet(Name = "GetParticipants")]
        public async Task<IActionResult> GetParticipants(int activityId)
        {

            var participantsFromRepo = await _repo.GetParticipants(activityId);

            // if (participantsFromRepo == null)
            //     return NotFound();

            return Ok(participantsFromRepo);
        }
        

        [HttpGet("{userId}", Name = "GetParticipant")]
        public async Task<IActionResult> GetParticipant(int activityId, int userId)
        {

            var participantFromRepo = await _repo.GetParticipant(activityId, userId);

            // if (participantsFromRepo == null)
            //     return NotFound();

            return Ok(participantFromRepo);
        }

        [HttpPost("{userId}", Name = "AddParticipant")]
        public async Task<IActionResult> AddParticipant(int activityId, int userId, Participant participant)
        {

            var user = await _repo.GetUser(userId);

            if (user.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();


            // var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(participant);

            if (await _repo.SaveAll())
            {
                // var messageToReturn = _mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetParticipant",
                    new {userId = userId, activityId = participant.ActivityId}, participant);
                // return Ok(participant);
            }

            throw new Exception("Adding participant failed on save");
        }
    }
}