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
    public class ShareController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Share
        public IQueryable<Travel> GetTravels()
        {
            return db.Travels;
        }

        // GET: api/Share/5
        [ResponseType(typeof(IEnumerable<ApplicationUser>))]
        public IHttpActionResult GetUsersOfTravel(int id)
        {
            Travel travel = db.Travels.Find(id);
            if (travel == null)
            {
                return NotFound();
            }

            return Ok(travel.ApplicationUsers);
        }

        // PUT: api/Share/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTravel(int id, Travel travel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != travel.TravelId)
            {
                return BadRequest();
            }

            db.Entry(travel).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TravelExists(id))
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

        // POST: api/Share
        [ResponseType(typeof(Travel))]
        public IHttpActionResult PostTravel(ShareDTO infos)
        {

            string username = infos.username;
            int travelId = infos.travelid;

            Travel trav = db.Travels.Find(travelId);

            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(db);
            UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(userStore);
            ApplicationUser user = userManager.FindByEmail(username);

            
            if(!trav.ApplicationUsers.Contains(user))
            {
                trav.ApplicationUsers.Add(user);
            }

            db.SaveChanges();

            return Ok(trav);
        }

        // DELETE: api/Share/5
        [ResponseType(typeof(Travel))]
        public IHttpActionResult DeleteShare(ShareDTO infos)
        {
            string username = infos.username;
            int travelId = infos.travelid;

            Travel trav = db.Travels.Find(travelId);

            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(db);
            UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(userStore);
            ApplicationUser user = userManager.FindByEmail(username);


            if (trav.ApplicationUsers.Contains(user))
            {
                trav.ApplicationUsers.Remove(user);
            }

            db.SaveChanges();

            return Ok(trav);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TravelExists(int id)
        {
            return db.Travels.Count(e => e.TravelId == id) > 0;
        }
    }
}