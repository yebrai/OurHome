// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "OurHome";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

app.use((req, res, next)=> {
        if(req.session.userOnline || req.session.professionalOnline 
         // if (req.session.userOnline.role === 'admin')
         ) {
        // user on
        res.locals.isUserActive = true
     } else {
        // user of
        res.locals.isUserActive = false
     }
     next()
    })

app.use((req, res, next)=> {
      if(req.session.professionalOnline) {
      // user on
      res.locals.isProfessionalActive = true
   } else {
      // user of
      res.locals.isProfessionalActive = false
   }
   next()
   })

app.use((req, res, next)=> {
      if(req.session.userOnline ) {
      // user on
      res.locals.isuserActive = true
   } else {
      // user of
      res.locals.isuserActive = false
   }
   next()
   })

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
