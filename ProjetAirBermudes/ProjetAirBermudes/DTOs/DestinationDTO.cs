using AirBermudesAPI.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.DTOs
{
    public class DestinationDTO
    {
        public int DestinationID { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
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
            this.DayID = pDestination.Day.DayID;
            
        }
    }
}