using System;
using System.Collections.Generic;

namespace WeActive.API.Models
{
    public class ActivityToReturnDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int HostId { get; set; }
        public string HostUsername { get; set; }
        public string HostPhotoUrl { get; set; }

        public bool PrivateActivity { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime StartDate { get; set; }
        public bool FlexStartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool FlexEndDate { get; set; }

        public string Place { get; set; }

        public int MinParticipantsNumber { get; set; }
        public int MaxParticipantsNumber { get; set; }
        public int ParticipantsNumber { get; set; }
        public List<Participant> Participants { get; set; }
        public DateTime ParticipantsListClosureTime { get; set; }

        public DateTime ConfirmationTime { get; set; }

        public Status Status { get; set; }

        public ActivityType ActivityType { get; set; }
        public string Description { get; set; }


    }
}