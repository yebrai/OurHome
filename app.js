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

app.locals.appTitle = `${capitalize(projectName)}`;

app.use((req, res, next)=> {
   if(req.session.userOnline) {
      res.locals.isUserActive = true
          if (req.session.userOnline.role === 'admin') {
            res.locals.isAdminActive = true
            res.locals.isUserActive = false
          }
        // user on
     } else {
        // user of
        res.locals.isUserActive = false
        res.locals.isAdminActive = false
     }
     next()
    })

app.use((req, res, next)=> {
      if(req.session.professionalOnline) {
      // user on
      res.locals.isUserActive = true
      res.locals.isProfessionalActive = true
   } else {
      // user of
      res.locals.isProfessionalActive = false
   }
   next()
   })


// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
