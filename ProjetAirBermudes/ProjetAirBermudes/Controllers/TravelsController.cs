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
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using ProjetAirBermudes;

namespace AirBermudesAPI.Controllers
{
    [Authorize]
    public class TravelsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        /*
        // GET: api/Travels
        public IQueryable<Travel> GetTravels()
        {
            return db.Travels;
        }
        */
        
        // GET api/Travels
        [ResponseType(typeof(IEnumerable<Travel>))]
        public IHttpActionResult GetTravels()
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(db);
            UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(userStore);
            ApplicationUser user = userManager.FindById(User.Identity.GetUserId());
            List<TravelDTO> travelsDTO = new List<TravelDTO>();

            if (user != null)
            {
                List<Travel> travels = db.Travels.Where(t => t.ApplicationUsers.Any(au => au.Id == user.Id)).ToList();

                foreach (Travel travel in travels)
                {
                    travelsDTO.Add(new TravelDTO(travel));
                }
            }
            return Ok(travelsDTO);
        }
        

        // GET: api/Travels/5
        [ResponseType(typeof(Travel))]
        public IHttpActionResult GetTravel(int id)
        {
            Travel travel = db.Travels.Find(id);
            if (travel == null)
            {
                return NotFound();
            }

            return Ok(travel);
        }

        // PUT: api/Travels/5
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

        // POST: api/Travels
        [ResponseType(typeof(TravelDTO))]
        public IHttpActionResult PostTravel(Travel travel)
        {

            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(db);
            UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(userStore);
            ApplicationUser user = userManager.FindById(User.Identity.GetUserId());

            if (travel.ApplicationUsers == null)
            {
                travel.ApplicationUsers = new List<ApplicationUser>();
            }

            travel.ApplicationUsers.Add(user);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Travels.Add(travel);
            db.SaveChanges();

            if(user.Travels == null)
            {
                user.Travels = new List<Travel>();
            }

            user.Travels.Add(travel);
            db.SaveChanges();

            TravelDTO travelDTO = new TravelDTO(travel);

            return Ok(travelDTO);
        }

        // DELETE: api/Travels/5
        [ResponseType(typeof(Travel))]
        public IHttpActionResult DeleteTravel(int id)
        {
            Travel travel = db.Travels.Find(id);
            if (travel == null)
            {
                return NotFound();
            }

            db.Travels.Remove(travel);
            db.SaveChanges();

            return Ok(travel);
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

        //public List<Travel> GetRealTravelsNoLazyLoading(int userId)
        //{
        //    List<Travel> realTravels = db.Travels.Where(t => t.TravelId == user.Cart.CartId).SingleOrDefault();

        //    if (realCart == null)
        //        return null;

        //    foreach (Product_Qty item in realCart.Content)
        //    {
        //        Product_Qty prod = db.Product_Qtys.Include(pqty => pqty.Product).Where(p => p.Product_QtyId == item.Product_QtyId).SingleOrDefault();
        //        item.Product = prod.Product;
        //    }

        //    return realCart;
        //}
    }
}




/*

 // POST: api/Travels
        //[ResponseType(typeof(Travel))]
        public IHttpActionResult PostTravel(TravelDTO travelDTO)
        {

            //UserManager<ApplicationUser> UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
            //ApplicationUser user = UserManager.FindByEmail(travelDTO.username);

            //ApplicationUser user = db.Users.Where(u => u.Email.Equals(travelDTO.username)).Include(u => u.Travels).SingleOrDefault();

            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(db);
            UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(userStore);
            ApplicationUser user = userManager.FindById(User.Identity.GetUserId());

            Travel trav = new Travel();

            trav.Budget = travelDTO.Budget;
            trav.DateBegin = DateTime.Parse(travelDTO.DateBegin);
            trav.DateEnd = DateTime.Parse(travelDTO.DateEnd);
            trav.Title = travelDTO.Title;


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Travels.Add(trav);
            db.SaveChanges();

            if(user.Travels == null)
            {
                user.Travels = new List<Travel>();
            }

            user.Travels.Add(trav);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = trav.TravelId }, trav);
        }



*/