using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WeActive.API.Helpers;
using WeActive.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WeActive.API.Data
{
    public class Repository : IRepository
    {
        private readonly DataContext _context;
        public Repository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u =>
                u.Liker.Id == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId)
                .FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {

            var users = _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge - 1);

                users = users.Where(u => u.DateofBirth >= minDob && u.DateofBirth <= maxDob);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
            .Include(x => x.Likers)
            .Include(x => x.Likees)
            .FirstOrDefaultAsync(u => u.Id == id);

            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);

            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId
                        && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId
                        && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId
                        && u.RecipientDeleted == false && u.IsRead == false);
                    break;
            }
            messages = messages.OrderByDescending(d => d.MessageSent);

            return await PagedList<Message>.CreateAsync(messages,
                messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .Where(m => m.RecipientId == userId && m.RecipientDeleted == false
                    && m.SenderId == recipientId
                    || m.RecipientId == recipientId && m.SenderDeleted == false
                    && m.SenderId == userId)
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

            return messages;
        }

        public async Task<Activity> GetActivity(int id)
        {
            // temp
            var activitys = await _context.Activities.ToListAsync();
                // .Include(u => u.Host)
                // .ThenInclude(p => p.Photos)
                // .Include(u => u.Participants.Select(p => p.User))
                // .ThenInclude(p => p.Photos)
                var activity = activitys.Where(a => a.Id == id).FirstOrDefault();
                // .FirstOrDefaultAsync(a => a.Id == id);

            return activity;
        }

        public async Task<PagedList<Activity>> GetActivities(ActivityParams activityParams)
        {
            var activities = _context.Activities
                .Include(u => u.Host)
                .ThenInclude(p => p.Photos)
                .AsQueryable();

            if ((ActivityType) activityParams.activityType != ActivityType.Undefined)    //check
            {
                activities = activities.Where(a => a.ActivityType == (ActivityType) activityParams.activityType);
            }

            return await PagedList<Activity>.CreateAsync(activities,
                activityParams.PageNumber, activityParams.PageSize); ;
        }

        public async Task<IEnumerable<Participant>> GetParticipants(int activityId)
        {
            var participants = await _context.Participants
                .Where(p => p.ActivityId == activityId).ToListAsync();

            return participants;
        }

        public async Task<Participant> GetParticipant(int activityId, int userId)
        {
            var participant = await _context.Participants
                .FirstOrDefaultAsync(p => p.ActivityId == activityId && p.UserId == userId);

            return participant;
        }

        public async Task<Comment> GetComment(int id)
        {
            var comment = await _context.Comments
                .Include(c => c.Sender).ThenInclude(s => s.Photos)
                .Include(c => c.Replies).ThenInclude(r => r.Sender).ThenInclude(s => s.Photos)
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();

            return comment;
        }

        public async Task<IEnumerable<Comment>> GetComments(int activityId)
        {
            var comments = await _context.Comments
                .Include(c => c.Sender).ThenInclude(s => s.Photos)
                .Include(c => c.Replies).ThenInclude(r => r.Sender).ThenInclude(s => s.Photos)
                .Where(c => c.ActivityId == activityId && c.ParentId == null)
                .OrderByDescending(m => m.TimeSent)
                .ToListAsync();

            return comments;
        }
    }
}