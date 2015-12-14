using AirBermudesAPI.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.DTOs
{
    public class DayDTO
    {
        public int Id { get; set; }
        
        public int Position { get; set; }

        [Required]
        public string Date { get; set; }

        [Required]
        public decimal Budget { get; set; }

        // Empty constructor
        public DayDTO() { }

        public DayDTO(int position, Day d)
        {
            this.Id = d.DayID;
            this.Position = position;
            this.Date = d.Date.ToString("yyyy-MM-dd");
            this.Budget = d.Budget;
        }

        public DayDTO(Day d)
        {
            this.Id = d.DayID;
            this.Date = d.Date.ToString("yyyy-MM-dd");
            this.Budget = d.Budget;
        }

        public Day ToDay()
        {
            Day d = new Day();
            d.Date = DateTime.Parse(this.Date);
            d.Budget = this.Budget;
            return d;
        }

        public void CopyToDay(Day d)
        {
            d.Date = DateTime.Parse(this.Date);
            d.Budget = this.Budget;
        }
    }
}