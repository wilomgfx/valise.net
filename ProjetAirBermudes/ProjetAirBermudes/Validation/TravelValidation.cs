using AirBermudesAPI.Models;
using ProjetAirBermudes.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Validation
{
    public abstract class TravelValidation : IValidatableObject
    {

        public abstract int TravelId { get; set; }

        public abstract string Title { get; set; }

        public abstract DateTime? DateBegin { get; set; }
        public abstract DateTime? DateEnd { get; set; }
        public abstract int? nbDays { get; set; }

        public abstract decimal Budget { get; set; }

        public abstract List<ApplicationUser> ApplicationUsers { get; set; }

        public abstract List<Course> Courses { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            yield return TravelDateNbDaysValidator.Validate(this);
        }

    }
}