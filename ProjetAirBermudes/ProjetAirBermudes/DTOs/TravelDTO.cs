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

        public decimal Budget { get; set; }

        //public string username { get; set; }

        public TravelDTO(Travel travel)
        {
            this.TravelId = travel.TravelId;
            this.Title = travel.Title;
            this.DateBegin = travel.DateBegin.ToLongDateString();
            this.DateEnd = travel.DateEnd.ToLongDateString();
            this.Budget = travel.Budget;
        }
    }
}