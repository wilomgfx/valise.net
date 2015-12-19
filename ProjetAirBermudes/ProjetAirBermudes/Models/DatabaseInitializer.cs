using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using ProjetAirBermudes.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace AirBermudesAPI.Models
{
    public class DatabaseInitializer : DropCreateDatabaseAlways<ApplicationDbContext>
    {
        protected override void Seed(ApplicationDbContext context)
        {
            // Roles
            RoleManager<IdentityRole> roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            IdentityRole adminRole = new IdentityRole("admin");
            roleManager.Create(adminRole);

            IdentityRole clientRole = new IdentityRole("client");
            roleManager.Create(clientRole);

            UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

            // Utilisateurs
            ApplicationUser admin = new ApplicationUser();
            admin.UserName = admin.Email = "admin@airbermudes.com";
            userManager.Create(admin, "Test1234");
            userManager.AddToRole(admin.Id, adminRole.Name);

            ApplicationUser user1 = new ApplicationUser();
            user1.UserName = user1.Email = "test@test.com";
            userManager.Create(user1, "Passw0rd/");
            userManager.AddToRole(user1.Id, clientRole.Name);

            ApplicationUser user2 = new ApplicationUser();
            user2.UserName = user2.Email = "user2@gmail.com";
            userManager.Create(user2, "Test1234");
            userManager.AddToRole(user2.Id, clientRole.Name);
            
            // Transports
            Transport plane = new Transport { TransportName = "Plane" };
            Transport taxi = new Transport { TransportName = "Taxi" };
            Transport bus = new Transport { TransportName = "Bus" };
            Transport car = new Transport { TransportName = "Car" };
            Transport bike = new Transport { TransportName = "Bike" };
            Transport bull = new Transport { TransportName = "Bull" };

            context.Transports.Add(plane);
            context.Transports.Add(taxi);
            context.Transports.Add(bus);
            context.Transports.Add(car);
            context.Transports.Add(bike);
            context.Transports.Add(bull);

            // Travels
            Travel france = new Travel { Title = "France", Budget = 15000, nbDays = 12, ApplicationUsers = new List<ApplicationUser>()};
            france.ApplicationUsers.Add(user1);
            france.ApplicationUsers.Add(user2);
            
            france.Courses = new List<Course>();
            france.Courses.Add(new Course()
            {
                StartDate = new DateTime(2016, 1, 10, 7, 0, 0),
                EndDate = new DateTime(2016, 1, 11, 5, 0, 0),
                DepartureAddress = "945, Chemin de Chambly, Longueuil,Quebec",
                DestinationAddress = "2 Rue Palatine,75006 Paris,France",
                Transport = plane,
                TransportCompanyName = "AirCanada",
                Travel = france
            });

            france.Courses.Add(new Course()
            {
                StartDate = new DateTime(2016, 1, 13, 8, 0, 0),
                EndDate = new DateTime(2016, 1, 13, 20, 0, 0),
                DepartureAddress = "2 Rue Palatine,75006 Paris,France",
                DestinationAddress = "Carrer de Mallorca, 401,08013 Barcelona,Spain",
                Transport = bull,
                TransportCompanyName = "FastBull",
                Travel = france
            });
            context.Travels.Add(france);

            Day day11 = new Day() { Date = new DateTime(2016, 1, 11), Budget = 560, Travel = france };
            Day day12 = new Day() { Date = new DateTime(2016, 1, 12), Budget = 450, Travel = france };

            context.Days.Add(day11);
            context.Days.Add(day12);

            
            context.SaveChanges();

            base.Seed(context);
        }

    }

}