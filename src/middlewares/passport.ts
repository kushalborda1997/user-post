import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import config from '../configuration';

import User from '../models/user';

passport.use('login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    async (email, password, done) => {
        try {        
            const user = await User.findOne({ email, isDeleted: false });
            if (!user) 
                return done(null, false, { message: "User doesn't exists!"});

            const validate = await bcrypt.compare(password, user.password);
            if(!validate) 
                return done(null, false, { message: "Invalid password!" });

            return done(null, user);
        } catch (error) {
            done(error)
        }
    }    
));


passport.use(new jwtStrategy({
        secretOrKey: config.tokenSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() 
    },
    async (token, done ) => {
        let user = await User.findOne({ _id: token.user._id, isDeleted: false })
            .populate({ path: 'role', select: { _id: 0, name: 1 }});

        if (user) {
            token.user.role = user?.role.name;
            return done(null, token.user);
        }
        else return done(null, false, { message: "Invalid Token."});
    }
))