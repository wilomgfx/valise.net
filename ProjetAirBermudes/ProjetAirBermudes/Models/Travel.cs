using ProjetAirBermudes.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Models
{
    public class Travel
    {
        public int TravelId { get; set; }

        public string Title { get; set; }

        public DateTime DateBegin { get; set; }
        public DateTime DateEnd { get; set; }

        public decimal Budget { get; set; }

        public List<ApplicationUser> ApplicationUsers { get; set; }
    }
}