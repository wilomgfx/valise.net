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
            

            Transport avion = new Transport();
            avion.TransportName = "Avion";

            Transport taxi = new Transport();
            taxi.TransportName = "Taxi";

            Transport bus = new Transport();
            bus.TransportName = "Bus";

            Transport car = new Transport();
            car.TransportName = "Automobile";

            Transport velo = new Transport();
            velo.TransportName = "Vélo";

            Transport boeuf = new Transport();
            boeuf.TransportName = "Boeuf";

            List<Transport> lstTransports = new List<Transport>();
            lstTransports.Add(avion);
            lstTransports.Add(taxi);
            lstTransports.Add(bus);
            lstTransports.Add(car);
            lstTransports.Add(velo);
            lstTransports.Add(boeuf);

            foreach(Transport t in lstTransports)
            {
                context.Transports.Add(t);
            }
            context.SaveChanges();

            base.Seed(context);
        }

    }

}