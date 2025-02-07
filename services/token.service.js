const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const {user} = require('../models/users');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class TokenService {
    generateTokens(payload) {
        console.log(payload)
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30m'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    async validateGoogleIdToken(token){
        console.log(process.env.GOOGLE_CLIENT_ID)
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, 
            
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload)
        return payload
    }

    // async saveToken(userId, refreshToken) {
    //     const tokenData = await user.findOne({user: userId})
    //     if (tokenData) {
    //         tokenData.refreshToken = refreshToken;
    //         return tokenData.save();
    //     }
    //     // const token = await tokenModel.create({user: userId, refreshToken})
    //     return token;
    // }

    async removeToken(refreshToken) {
        const userData = await user.findOne({"refreshToken":refreshToken})
        userData.refreshToken = ""
        await userData.save()
        return userData;
    }

    async findToken(refreshToken) {
        const tokenData = await user.findOne({refreshToken})
        return tokenData;
    }
}

module.exports = new TokenService();
