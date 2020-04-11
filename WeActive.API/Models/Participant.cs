namespace WeActive.API.Models
{
    public class Participant
    {
        public int ActivityId { get; set; }
        public Activity Activity { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public ParticipantStatus ParticipantStatus { get; set; }
    }

    public enum ParticipantStatus { Joined, Interested, Unconfirmed, Resigned}
}