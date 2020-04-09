using System.Threading.Tasks;
using WeActive.API.Models;

namespace WeActive.API.Data
{
    public interface IAuthRepository
    {
        Task<User> Register (User user, string password);
        Task<User> Login (string username, string password);
        Task<bool> UserExists(string username);
    }
}