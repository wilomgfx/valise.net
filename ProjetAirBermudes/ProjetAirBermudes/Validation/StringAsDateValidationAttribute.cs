﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Validation
{
    [AttributeUsage(AttributeTargets.Property, Inherited = true)]
    public class StringAsDateValidationAttribute : ValidationAttribute
    {

        public override bool IsValid(object value)
        {
            var dateString = value as string;
            if (string.IsNullOrWhiteSpace(dateString))
            {
                return true; // Not our problem
            }
            DateTime result;
            var success = DateTime.TryParse(dateString, out result);
            return success;
        }
    }
}