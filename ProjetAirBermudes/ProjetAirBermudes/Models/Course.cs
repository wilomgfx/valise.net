using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Models
{
    public class Course
    {
        public int CourseID { get; set; }

        public DateTime Startate { get; set; }

        public DateTime EndDate { get; set; }

        public string DestinationAddress { get; set; }

        public string DepartureAddress { get; set; }

        public virtual Transport Transport { get; set; }

        public virtual Travel Travel { get; set; }
    }
}