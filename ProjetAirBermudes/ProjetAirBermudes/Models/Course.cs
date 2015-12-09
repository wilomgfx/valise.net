using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Models
{
    public class Course
    {
        public int CourseID { get; set; }

        [Required]
        public DateTime? StartDate { get; set; }

        [Required]
        public DateTime? EndDate { get; set; }

        [Required]
        public string DestinationAddress { get; set; }

        [Required]
        public string DepartureAddress { get; set; }

        [Required]
        public string TransportCompanyName { get; set; }

        [Required]
        public virtual Transport Transport { get; set; }

        //public decimal Budget { get; set; }

        public virtual Travel Travel { get; set; }
    }
}