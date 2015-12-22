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
        [ResponseType(typeof(ShareUsersDTO))]
        public IHttpActionResult GetUsersOfTravel(int id)
        {
            Travel travel = db.Travels.Find(id);
            if (travel == null)
            {
                return NotFound();
            }

            ShareUsersDTO dto = new ShareUsersDTO();
            dto.Users = new List<UserDTO>();

            foreach (ApplicationUser user in travel.ApplicationUsers)
            {
                UserDTO us = new UserDTO();
                us.UserId = user.Id;
                us.Username = user.UserName;

                dto.Users.Add(us);
            }

            return Json(dto);

            //return Ok(travel.ApplicationUsers.ToList());
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
        [ResponseType(typeof(TravelDTO))]
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
                if(user.Travels == null)
                {
                    user.Travels = new List<Travel>();
                }
                user.Travels.Add(trav);
            }

            db.SaveChanges();

            TravelDTO dto = new TravelDTO(trav);

            return Ok(dto);
        }

        // DELETE: api/Share/5
        [ResponseType(typeof(TravelDTO))]
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
                if (user.Travels == null)
                {
                    user.Travels = new List<Travel>();
                }
                else
                {
                    user.Travels.Remove(trav);
                }
            }

            db.SaveChanges();

            TravelDTO dto = new TravelDTO(trav);

            return Ok(dto);
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