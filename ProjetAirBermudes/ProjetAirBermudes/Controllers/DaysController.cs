using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using AirBermudesAPI.Models;
using ProjetAirBermudes.Models;
using AirBermudesAPI.DTOs;

namespace AirBermudesAPI.Controllers
{
    public class DaysController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Days
        public DayListDTO GetDays()
        {
            DayListDTO days = new DayListDTO(db.Days.ToList());
            return days;
        }

        // GET: api/Days/5
        [ResponseType(typeof(DayDTO))]
        public IHttpActionResult GetDay(int id)
        {
            Day day = db.Days.Find(id);
            if (day == null)
            {
                return NotFound();
            }

            return Ok(new DayDTO(day));
        }

        // PUT: api/Days/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutDay(int id, DayDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.Id)
            {
                return BadRequest();
            }

            Day day = db.Days.Where(d => d.DayID == id).FirstOrDefault();
            if(day == null)
                return NotFound();

            model.CopyToDay(day);
            db.Entry(day).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Days
        [ResponseType(typeof(Day))]
        public IHttpActionResult PostDay(DayDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Day day = model.ToDay();
            db.Days.Add(day);
            db.SaveChanges();
                        
            return CreatedAtRoute("DefaultApi", new { id = day.DayID }, new DayDTO(day));
        }

        // DELETE: api/Days/5
        [ResponseType(typeof(Day))]
        public IHttpActionResult DeleteDay(int id)
        {
            Day day = db.Days.Find(id);
            if (day == null)
            {
                return NotFound();
            }

            db.Days.Remove(day);
            db.SaveChanges();

            return Ok(day);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        /*private bool DayExists(int id)
        {
            return db.Days.Count(e => e.DayID == id) > 0;
        }*/
    }
}