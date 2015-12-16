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

        //public string username { get; set; }

        public TravelDTO(Travel travel)
        {
            this.TravelId = travel.TravelId;
            this.Title = travel.Title;
            
            if (travel.DateBegin.HasValue)
            {
                this.DateBegin = travel.DateBegin.Value.ToLongDateString();
            }
            else
            {
                this.DateBegin = "";
            }
            
            //this.DateBegin = travel.DateBegin.ToLongDateString();
            
            if (travel.DateEnd.HasValue)
            {
                this.DateEnd = travel.DateEnd.Value.ToLongDateString();
            }
            else
            {
                this.DateEnd = "";
            }
            
            //this.DateEnd = travel.DateEnd.ToLongDateString();

            this.NbDays = travel.nbDays;

            this.Budget = travel.Budget;
        }
    }
}