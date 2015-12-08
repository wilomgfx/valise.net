using AirBermudesAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.DTOs
{
    public class DayDTO
    {
        public int DayID { get; set; }
        
        public string DayDate { get; set; }

        public decimal Budget { get; set; }

        public DayDTO(Day d)
        {
            this.DayID = d.DayID;
            this.DayDate = d.DayDate.ToString("yyyy-MM-dd");
            this.Budget = d.Budget;
        }
    }
}