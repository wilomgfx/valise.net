using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Models
{
    public class Day
    {
        public int DayID { get; set; }

        public DateTime Date { get; set; }

        public decimal Budget { get; set; }

        public ICollection<Destination> Destinations { get; set; }
        
        // For later use:
        //[Foreignkey("Travel")]
        //public int TravelID { get; set; }
        //public Travel Travel { get; set; }
    }
}