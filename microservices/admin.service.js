const AdminBro = require("admin-bro");
const AdminBroExpress = require("admin-bro-expressjs");
const AdminBroMongoose = require("admin-bro-mongoose");

const mongoose = require("mongoose");
const UserModel = require("../models/user.model");
const courseModel = require("../models/course.model");
const onboardModel = require("../models/onboarding.model");

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  databases: [mongoose],
  resources: [
    {
      resource: UserModel,
      options: { parent: { name: "Users" } }
    },
    {
      resource: courseModel,
      options: { parent: { name: "Courses" } }
    },
    {
      resource: onboardModel,
      options: { parent: { name: "Onboarding" } }
    }
  ],
  rootPath: "/admin",
  branding: {
      logo : 'https://th.bing.com/th/id/R.fdc4666566004b29534b5d2ce62f21c5?rik=003rzLnPzgrwdA&riu=http%3a%2f%2flogok.org%2fwp-content%2fuploads%2f2014%2f12%2fTelstra-logo-2011-blue.png&ehk=Vig%2bE4VcffytVMOGfi2sqTOd9pHm2x%2bgk%2fOJYvpwBWg%3d&risl=&pid=ImgRaw&r=0',
    companyName: "Telstra",
    softwareBrothers: false,
  },
  dashboard: {
    component: AdminBro.bundle("./services/Dashboard.tsx"),
  },
});

const ADMIN = {
  Email:  "Test",
  Password:  "Password",
};

module.exports = AdminBroExpress.buildAuthenticatedRouter(
  adminBro,
  {
    cookieName:  "admin-bro",
    cookiePassword:  "supersecret-long-password",
    authenticate: async (Email, Password) => {
      if (Email === ADMIN.Email && Password === ADMIN.Password) {
        return ADMIN;
      }
      return null;
    },
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);