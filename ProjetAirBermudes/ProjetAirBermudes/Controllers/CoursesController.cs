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
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace AirBermudesAPI.Controllers
{
    public class CoursesController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Courses
        public IQueryable<CourseDTO> GetCourses()
        {
            // TODO: get the travel associated with that user, and return the right courses for that current travel

            List<CourseDTO> listeCourseDTO = new List<CourseDTO>();
            foreach (Course course in db.Courses.Include(c => c.Transport))
            {
                CourseDTO courseDTO = new CourseDTO(course);
                listeCourseDTO.Add(courseDTO);
            }
            return listeCourseDTO.AsQueryable<CourseDTO>();
        }

        // GET: api/Courses/5
        [ResponseType(typeof(Course))]
        public IHttpActionResult GetCourse(int id)
        {
            Course course = db.Courses.Find(id);
            if (course == null)
            {
                return NotFound();
            }

            return Ok(course);
        }

        // PUT: api/Courses/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCourse(int id, CourseDTO courseDTO)
        {
            Course course = new Course();
            course.CourseID = courseDTO.Id;
            course.DepartureAddress = courseDTO.DepartureAddress;
            course.DestinationAddress = courseDTO.DestinationAddress;
            course.StartDate = courseDTO.StartDate;
            course.EndDate = courseDTO.EndDate;
            course.TransportCompanyName = courseDTO.TransportCompanyName;
            Transport transport = (Transport)db.Transports.Where(t => t.TransportName == courseDTO.TransportName).First();
            course.Transport = transport;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != course.CourseID)
            {
                return BadRequest();
            }

            db.Entry(course).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
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

        // POST: api/Courses
        [ResponseType(typeof(Course))]
        public IHttpActionResult PostCourse(CourseDTO courseDTO)
        {
            Course course = new Course();
            course.CourseID = courseDTO.Id;
            course.DepartureAddress = courseDTO.DepartureAddress;
            course.DestinationAddress = courseDTO.DestinationAddress;
            course.StartDate = courseDTO.StartDate;
            course.EndDate = courseDTO.EndDate;
            course.TransportCompanyName = courseDTO.TransportCompanyName;
            Transport transport = (Transport)db.Transports.Where(t => t.TransportName == courseDTO.TransportName).First();
            course.Transport = transport;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Courses.Add(course);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = course.CourseID }, course);
        }

        // DELETE: api/Courses/5
        [ResponseType(typeof(Course))]
        public IHttpActionResult DeleteCourse(int id)
        {
            Course course = db.Courses.Find(id);
            if (course == null)
            {
                return NotFound();
            }

            db.Courses.Remove(course);
            db.SaveChanges();

            return Ok(course);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CourseExists(int id)
        {
            return db.Courses.Count(e => e.CourseID == id) > 0;
        }
    }
}