import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'

dotenv.config()

const secret = process.env.JWT_SECRET || 'default_jwt_secret'

interface TokenPayload extends JwtPayload {
    _id: string;
}

export const generateToken = (userId: string) => {
    // Do not set token expiration => handle logout from the client
    // TODO: implement refresh token
    return jwt.sign({ _id: userId }, secret, {})
}

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, secret) as TokenPayload
}