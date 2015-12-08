using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Models
{
    public class TravelDTO
    {
        public string Title { get; set; }

        public string DateBegin { get; set; }
        public string DateEnd { get; set; }

        public decimal Budget { get; set; }

        public string username { get; set; }
    }
}