using AirBermudesAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.DTOs
{
    public class CourseDTO
    {
        public int Id { get; set; }
        public string TransportName { get; set; }

        public string TransportCompanyName { get; set; }

        public DateTime Startate { get; set; }

        public DateTime EndDate { get; set; }

        public string DestinationAddress { get; set; }

        public string DepartureAddress { get; set; }

        public CourseDTO(Course pCourse)
        {
            this.Id = pCourse.CourseID;
            this.TransportName = pCourse.Transport.TransportName;
            this.TransportCompanyName = pCourse.TransportCompanyName;
            this.Startate = pCourse.Startate;
            this.EndDate = pCourse.EndDate;
            this.DestinationAddress = pCourse.DestinationAddress;
            this.DepartureAddress = pCourse.DepartureAddress;
        }
    }
}