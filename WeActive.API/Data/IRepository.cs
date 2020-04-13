using System.Collections.Generic;
using System.Threading.Tasks;
using WeActive.API.Helpers;
using WeActive.API.Models;

namespace WeActive.API.Data
{
    public interface IRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;

        Task<bool> SaveAll();
        Task<PagedList<User>> GetUsers(UserParams userparams);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int userId);
        Task<Like> GetLike(int userId, int recipientId);
        Task<Message> GetMessage(int id);
        Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
        Task<Activity> GetActivity(int id);
        Task<PagedList<Activity>> GetActivities(ActivityParams activityParams);
        Task<IEnumerable<Participant>> GetParticipants(int activityId);
        Task<Participant> GetParticipant(int activityId, int userId);
    }
}