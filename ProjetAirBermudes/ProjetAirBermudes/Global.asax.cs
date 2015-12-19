﻿using AirBermudesAPI.Models;
using ProjetAirBermudes.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ProjetAirBermudes
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {

            //DB initializer
            //Database.SetInitializer<ApplicationDbContext>(new DatabaseInitializer());

            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            //json stuff
            ValueProviderFactories.Factories.Add(new JsonValueProviderFactory());

            // Initialize DB
            Database.SetInitializer <ApplicationDbContext>(new DatabaseInitializer());
            using (var context = new ApplicationDbContext())
            {
                context.Database.Initialize(false);
            }
        }
    }
}
