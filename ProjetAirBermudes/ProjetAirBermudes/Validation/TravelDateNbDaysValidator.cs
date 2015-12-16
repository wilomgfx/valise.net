using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Validation
{
    public class TravelDateNbDaysValidator
    {

        public static ValidationResult Validate(TravelValidation t)
        {

            if (t.DateBegin != null && t.DateEnd != null && t.nbDays == null)
            {
                if (t.DateBegin < DateTime.Now)
                {
                    return new ValidationResult("The take off date is in the past.");
                }

                if (t.DateEnd < t.DateBegin)
                {
                    return new ValidationResult("The arrival date is earlier than the take off date.");
                }

                return ValidationResult.Success;
            }
            else if (t.DateBegin == null && t.DateEnd == null && t.nbDays != null)
            {
                if (t.nbDays < 1)
                {
                    return new ValidationResult("The number of days must be greater than 0.");
                }
            }
            else
            {
                return new ValidationResult("The duration of the travel is invalid or missign. You have to set the duration of the travel by specifing a date interval or a number of days.");
            }

            return ValidationResult.Success;
        }

    }
}