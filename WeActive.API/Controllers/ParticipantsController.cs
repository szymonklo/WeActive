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

        // [HttpGet]
        // public async Task <IActionResult> GetMessagesForUser(int userId, 
        // [FromQuery]MessageParams messageParams)
        // {
        //     if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        //         return Unauthorized();

        //     messageParams.UserId = userId;

        //     var messagerFromRepo = await _repo.GetMessagesForUser(messageParams);

        //     var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagerFromRepo);

        //     Response.AddPagination(messagerFromRepo.CurrentPage, messagerFromRepo.PageSize,
        //         messagerFromRepo.TotalCount, messagerFromRepo.TotalPages);

        //         return Ok(messages);
        // }

        // [HttpGet("thread/{recipientId}")]
        // public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        // {
        //     if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        //         return Unauthorized();

        //     var messagerFromRepo = await _repo.GetMessageThread(userId, recipientId);

        //     var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagerFromRepo);

        //     return Ok(messageThread);
        // }

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

        // [HttpPost("{id}")]
        // public async Task<IActionResult> DeleteMessage(int id, int userId)
        // {
        //     if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        //         return Unauthorized();

        //     var messageFromRepo = await _repo.GetMessage(id);

        //     if (messageFromRepo.SenderId == userId)
        //         messageFromRepo.SenderDeleted = true;

        //     if (messageFromRepo.RecipientId == userId)
        //         messageFromRepo.RecipientDeleted = true;

        //     if (messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
        //         _repo.Delete(messageFromRepo);

        //     if (await _repo.SaveAll())
        //         return NoContent();

        //     throw new Exception("Error deleting themessage");
        // }

        // [HttpPost("{id}/read")]
        // public async Task<IActionResult> MarkMessageAsRead(int userId, int id)
        // {
        //     if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        //         return Unauthorized();

        //     var message = await _repo.GetMessage(id);

        //     if (message.RecipientId != userId)
        //         return Unauthorized();

        //     message.IsRead = true;
        //     message.DateRead = DateTime.Now;

        //     await _repo.SaveAll();

        //     return NoContent();
        // }

    }
}