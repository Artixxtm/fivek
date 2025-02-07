
const userService = require("../services/user.service")
const {user} = require("../models/users");
const tokenService = require('../services/token.service');
const mailService = require("../services/mail.service")
const UserDTO = require("../dtos/user.dto") 
const axios = require("axios")

class UserController {
    async registration(req, res, next) {
        try {
            const userData = await userService.registration(req.body);
            // here
            if (typeof userData === "string") return res.json(userData);
            mailService.sendMail("sokolvek20067@gmail.com", "Hello", "Hello world", `<a href='http://localhost:3000/api/users/activate/${userData.user.activationLink}'>activate email</b>`)
            const userDTO = new UserDTO(userData.user)
            return res.json({accessToken: userData.accessToken, user: userDTO});
        } catch (e) {
            console.log(e)
            // next(e);
        }
    }

    async login(req, res, next) {
        try {
            const userData = await userService.login(req.body);
            if (typeof userData === "string") return res.json(userData);
            const userDTO = new UserDTO(userData.user)
            return res.json({accessToken: userData.accessToken, user: userDTO});
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json("updated");
        } catch (e) {
            next(e);
        }
    }

    async registerGoogleUser(req,res,next){
        const userData = await userService.registerGoogleUser()
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            console.log(activationLink)
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async googleAuth(req, res, next) {
        try {
            if (req.body.googleAccessToken) {
                const { googleAccessToken } = req.body;
                const userData = await userService.googleSign(googleAccessToken);

                if(userData) res.cookie('refreshToken', userData.user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                
                return res.json(userData);
            }
        } catch (e) {
            next(e)
        }
    }

    async googleSign(googleAccessToken) {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }
        })

        const email = response.data.email;
        const existingUser = await user.findOne({ email });

        const userData = {
            email,
            isActivated: true,
        }

        const tokens = tokenService.generateTokens({...userData});

        userData.refreshToken = tokens.refreshToken

        if(!existingUser) {
            const newUser = await user.create(userData);
            return {accessToken:tokens.accessToken, user:newUser};
        }

        existingUser.refreshToken = tokens.refreshToken;
        await existingUser.save();

        return { accessToken: tokens.accessToken, user: existingUser };
    }



    async getOneUser(req,res, next) {
        try{
            const foundUser = await user.findById(req.params.id)
            res.status(200).json(foundUser)
        } catch(e){
            next(e)
        }
    }
}


module.exports = new UserController();