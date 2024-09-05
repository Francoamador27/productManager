import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils/utils.js';

import {UserSchema } from '../DAO/schema/user.schema.js';
import GitHubStrategy from 'passport-github2';
import config from './config.js';
import { CartsService } from '../services/carts.services.js';
import { UserService } from '../services/users.services.js';
const LocalStrategy = local.Strategy;
const Carts = new CartsService()
const Users = new UserService()

export function iniPassport() {

    passport.use(
        'github',
        new GitHubStrategy(
          {
            clientID: config.clientId,
            clientSecret: config.clientSecret,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
          },
          async (accesToken, _, profile, done) => {
            try {
              const res = await fetch('https://api.github.com/user/emails', {
                headers: {
                  Accept: 'application/vnd.github+json',
                  Authorization: 'Bearer ' + accesToken,
                  'X-Github-Api-Version': '2022-11-28',
                },
              });
              const emails = await res.json();
              const emailDetail = emails.find((email) => email.verified == true);
    
              if (!emailDetail) {
                return done(new Error('cannot get a valid email for this user'));
              }
              profile.email = emailDetail.email;
    
              let user = await UserSchema.findOne({ email: profile.email });
              if (!user) {
                const newUser = {
                  email: profile.email,
                  firstName: profile._json.name || profile._json.login || 'noname',
                  lastName: 'nolast',
                  role: "user",
                  password: 'nopass',
                };
                let userCreated = await UserSchema.create(newUser);
                let cartCreate = await  Carts.createOne();
                await Users.addCart(newUser.email,cartCreate._id)

                return done(null, userCreated);
              } else {
                return done(null, user);
              }
            } catch (e) {
              return done(e);
            }
          }
        )
      );
    


  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        
        const user = await UserSchema.findOne({ email: username });
        if (!user) {
          return done(null, false);
        }
        if (!isValidPassword(password, user.password)) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body;
          let user = await UserSchema.findOne({ email: username });
          if (user) {
            return done(null, false);
          }

          const newUser = {
            email,
            firstName,
            lastName,
            role: "user",
            password: createHash(password),
          };
          let userCreated = await UserSchema.create(newUser);
          let cartCreate = await  Carts.createOne();
          await Users.addCart(newUser.email,cartCreate._id)
          return done(null, userCreated);
        } catch (e) {
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserSchema.findById(id);
    done(null, user);
  });
}
