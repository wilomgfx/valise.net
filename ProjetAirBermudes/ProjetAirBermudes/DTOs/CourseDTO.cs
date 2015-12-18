using AirBermudesAPI.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.DTOs
{
    public class CourseDTO
    {
        public int Id { get; set; }

        [Required]
        public string TransportName { get; set; }

        [Required]
        public string TransportCompanyName { get; set; }

        [Required]
        public DateTime? StartDate { get; set; }

        [Required]
        public DateTime? EndDate { get; set; }

        [Required]
        public string DestinationAddress { get; set; }

        [Required]
        public string DepartureAddress { get; set; }

        [Required]
        public int TravelID { get; set; }

        public CourseDTO()
        {

        }

        public CourseDTO(Course pCourse)
        {
            this.Id = pCourse.CourseID;
            this.TransportName = pCourse.Transport.TransportName;
            this.TransportCompanyName = pCourse.TransportCompanyName;
            this.StartDate = pCourse.StartDate;
            this.EndDate = pCourse.EndDate;
            this.DestinationAddress = pCourse.DestinationAddress;
            this.DepartureAddress = pCourse.DepartureAddress;
        }
    }
}