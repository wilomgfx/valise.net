﻿using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.Data.Entity;
using AirBermudesAPI.Models;
using System.Collections.Generic;

namespace ProjetAirBermudes.Models
{
    // Vous pouvez ajouter des données de profil pour l'utilisateur en ajoutant d'autres propriétés à votre classe ApplicationUser, consultez http://go.microsoft.com/fwlink/?LinkID=317594 pour en savoir davantage.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Notez que authenticationType doit correspondre à l'instance définie dans CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Ajouter des revendications d’utilisateur personnalisées ici
            return userIdentity;
        }
		
		public List<Travel> Travels { get; set; }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
            //Database.SetInitializer<ApplicationDbContext>(new DatabaseInitializer());
        }
        
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public System.Data.Entity.DbSet<AirBermudesAPI.Models.Course> Courses { get; set; }

        public DbSet<Day> Days { get; set; }

        public DbSet<Destination> Destinations { get; set; }

        public DbSet<Travel> Travels { get; set; }

        public System.Data.Entity.DbSet<AirBermudesAPI.Models.Transport> Transports { get; set; }

    }
}