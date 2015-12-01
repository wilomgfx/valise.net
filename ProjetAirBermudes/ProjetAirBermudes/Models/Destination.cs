using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Models
{
    public class Destination
    {
        public enum DestinationType
        {
            Hotel,Restaurant,Other
        }

        public int DestinationID { get; set; }

        public string Type { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }
    }
}