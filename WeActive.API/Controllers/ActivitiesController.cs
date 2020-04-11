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
    public class ActivitiesController : ControllerBase
    {
        private readonly IRepository _repo;
        private readonly IMapper _mapper;
        public ActivitiesController(IRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }

        [HttpGet("{id}", Name = "GetActivity")]
        public async Task<IActionResult> GetActivity(int id)
        {
            // if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();

            var activityFromRepo = await _repo.GetActivity(id);

            if (activityFromRepo == null)
                return NotFound();

            return Ok(activityFromRepo);
        }

        [HttpGet]
        public async Task <IActionResult> GetActivities([FromQuery]ActivityParams activityParams)
        {
            // if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();

            // activityParams.UserId = userId;

            var activitiesFromRepo = await _repo.GetActivities(activityParams);

            // var activitys = _mapper.Map<IEnumerable<ActivityToReturnDto>>(activityFromRepo);

            Response.AddPagination(activitiesFromRepo.CurrentPage, activitiesFromRepo.PageSize,
                activitiesFromRepo.TotalCount, activitiesFromRepo.TotalPages);

                return Ok(activitiesFromRepo);
        }

        [HttpPost]
        // public async Task<IActionResult> CreateActivity(int userId, ActivityForCreationDto activityForCreationDto)
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            activity.HostId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // var activity = _mapper.Map<Activity>(activityForCreationDto);

            _repo.Add(activity);

            if (await _repo.SaveAll())
            {
                // var activityToReturn = _mapper.Map<ActivityToReturnDto>(activity);
                return CreatedAtRoute("GetActivity",
                    new {activity.Id}, activity);
            }

            throw new Exception("Creating the activity failed on save");
        }

        // TODO - Cancel and delete after defined time

        // [HttpPost("{id}")]
        // public async Task<IActionResult> DeleteActivity(int id, int userId)
        // {
        //     if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        //         return Unauthorized();

        //     var activityFromRepo = await _repo.GetActivity(id);

        //     if (activityFromRepo.SenderId == userId)
        //         activityFromRepo.SenderDeleted = true;

        //     if (activityFromRepo.RecipientId == userId)
        //         activityFromRepo.RecipientDeleted = true;

        //     if (activityFromRepo.SenderDeleted && activityFromRepo.RecipientDeleted)
        //         _repo.Delete(activityFromRepo);

        //     if (await _repo.SaveAll())
        //         return NoContent();

        //     throw new Exception("Error deleting theactivity");
        // }


        // [HttpPost("{id}/read")]
        // public async Task<IActionResult> MarkActivityAsRead(int userId, int id)
        // {
        //     if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        //         return Unauthorized();

        //     var activity = await _repo.GetActivity(id);

        //     if (activity.RecipientId != userId)
        //         return Unauthorized();

        //     activity.IsRead = true;
        //     activity.DateRead = DateTime.Now;

        //     await _repo.SaveAll();

        //     return NoContent();
        // }

    }
}