using AirBermudesAPI.Validation;
using ProjetAirBermudes.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Models
{
    public class Travel : TravelValidation
    {
        public override int TravelId { get; set; }

        [Required]
        public override string Title { get; set; }

        public override DateTime? DateBegin { get; set; }
        public override DateTime? DateEnd { get; set; }
        public override int? nbDays { get; set; }

        [Required]
        public override decimal Budget { get; set; }

        public override List<ApplicationUser> ApplicationUsers { get; set; }
    }
}