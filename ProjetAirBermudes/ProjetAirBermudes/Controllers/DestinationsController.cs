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
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;
using AirBermudesAPI.DTOs;

namespace AirBermudesAPI.Controllers
{
    public class DestinationsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        //// GET: api/Destinations
        //public IQueryable<Destination> GetDestinations()
        //{
        //    return db.Destinations;
        //}

        [ResponseType(typeof(IEnumerable<Destination>))]
        public IHttpActionResult GetDestinations()
        {
            //UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(db);
            //UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(userStore);
            //ApplicationUser user = userManager.FindById(User.Identity.GetUserId());
            //List<Destination> destinations = db.Destinations.Where(t => t.ApplicationUsers.Any(au => au.Id == user.Id)).ToList();
            List<DestinationDTO> destinationDTOs = new List<DestinationDTO>();
            List<Destination> destinations = db.Destinations.ToList();

            foreach (Destination destination in destinations)
            {
                destinationDTOs.Add(new DestinationDTO(destination));
            }

            return Ok(destinationDTOs);
        }

        [HttpGet]
        [Route("api/Destinations/DestinationsForSpecificDay/{id}")]
        // GET: api/Destinations/DestinationsForSpecificDay/5
        [ResponseType(typeof(IEnumerable<Destination>))]
        public IHttpActionResult GetDestinationsForSpecificDay(int id)
        {
            //UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(db);
            //UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(userStore);
            //ApplicationUser user = userManager.FindById(User.Identity.GetUserId());
            //List<Destination> destinations = db.Destinations.Where(t => t.ApplicationUsers.Any(au => au.Id == user.Id)).ToList();
            List<DestinationDTO> destinationDTOs = new List<DestinationDTO>();
            //List<Destination> destinations = db.Days.Where(d => d.DayID == id).Include(d => d.Destinations).First().Destinations.ToList();
            List<Destination> destinations = db.Destinations.Where(d => d.Day.DayID == id).ToList();

            foreach (Destination destination in destinations)
            {
                destinationDTOs.Add(new DestinationDTO(destination));
            }

            return Ok(destinationDTOs);
        }

        // GET: api/Destinations/5
        [ResponseType(typeof(DestinationDTO))]
        public IHttpActionResult GetDestination(int id)
        {
            Destination destination = db.Destinations.Find(id);

            if (destination == null)
            {
                return NotFound();
            }

            //found
            DestinationDTO destDTO = new DestinationDTO(destination);

            return Ok(destDTO);
        }

        // PUT: api/Destinations/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutDestination(int id, Destination destination)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != destination.DestinationID)
            {
                return BadRequest();
            }

            db.Entry(destination).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DestinationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Destinations
        [ResponseType(typeof(Destination))]
        public IHttpActionResult PostDestination(DestinationDTO destinationDTO)
        {
            Destination newDestination = new Destination();
            newDestination.Address = destinationDTO.Address;
            newDestination.Name = destinationDTO.Name;
            newDestination.Type = destinationDTO.Type;
            Day associatedDay = db.Days.Where(d => d.DayID == destinationDTO.DayID).First();
            newDestination.Day = associatedDay;


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Destinations.Add(newDestination);
            db.SaveChanges();
            destinationDTO.DestinationID = newDestination.DestinationID;

            return CreatedAtRoute("DefaultApi", new { id = newDestination.DestinationID }, destinationDTO);
        }

        // DELETE: api/Destinations/5
        [ResponseType(typeof(Destination))]
        public IHttpActionResult DeleteDestination(int id)
        {
            Destination destination = db.Destinations.Find(id);
            if (destination == null)
            {
                return NotFound();
            }

            db.Destinations.Remove(destination);
            db.SaveChanges();

            return Ok(destination);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DestinationExists(int id)
        {
            return db.Destinations.Count(e => e.DestinationID == id) > 0;
        }
    }
}