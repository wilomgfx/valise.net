using AirBermudesAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.DTOs
{
    public class DestinationDTO
    {
        public int DestinationID { get; set; }

        public string Type { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public int DayID { get; set; }

        public DestinationDTO()
        {

        }

        public DestinationDTO(Destination pDestination)
        {
            this.DestinationID = pDestination.DestinationID;
            this.Type = pDestination.Type;
            this.Name = pDestination.Name;
            this.Address = pDestination.Address;
            //this.DayID = pDestination.Day.DayID;
            
        }
    }
}