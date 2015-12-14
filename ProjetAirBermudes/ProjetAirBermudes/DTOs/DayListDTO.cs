using AirBermudesAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.DTOs
{
    public class DayListDTO : List<DayDTO>
    {
        public DayListDTO(List<Day> list)
        {
           foreach(Day d in list) 
           {
               Add(new DayDTO(Count + 1, d));
           }
        }
    }
}