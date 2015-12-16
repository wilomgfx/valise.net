using AirBermudesAPI.DTOs;
using AirBermudesAPI.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Models
{
    public class TravelDTO
    {
        public int TravelId { get; set; }

        public string Title { get; set; }

        public string DateBegin { get; set; }
        public string DateEnd { get; set; }
        public int? NbDays { get; set; }

        public decimal Budget { get; set; }

        public List<CourseDTO> CourseDTOs { get; set; }

        public TravelDTO(Travel travel)
        {
            this.TravelId = travel.TravelId;

            this.Title = travel.Title;            

            this.DateBegin = travel.DateBegin.HasValue ? travel.DateBegin.Value.ToLongDateString() : "";

            this.DateEnd = travel.DateEnd.HasValue ? travel.DateEnd.Value.ToLongDateString() : "";
            
            this.NbDays = travel.nbDays;

            this.Budget = travel.Budget;

            if(travel.Courses != null)
            {
                this.CourseDTOs = new List<CourseDTO>();

                foreach(Course course in travel.Courses){

                    this.CourseDTOs.Add(new CourseDTO(course));
                }
            }

        }
    }
}