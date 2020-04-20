using System;
using System.Collections.Generic;

namespace WeActive.API.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public User Sender { get; set; }
        public int ActivityId { get; set; }
        public Activity Activity { get; set; }

        public string Content { get; set; }
        public DateTime TimeSent { get; set; }

        public int? ParentId { get; set; }
        public Comment? Parent { get; set; }
        public IList<Comment> Replies { get; set; }
    }
}