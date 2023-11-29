import { Request, Response } from 'express'
import passport from 'passport'
import logger from '../config/logger.config'

// export const getLogin = (req: any, res: Response) => {
//     console.log('getlogin')
//     const user = req.isAuthenticated()
//     if (user) {
//         res.redirect('/')
//     }
//     else {
//         res.redirect('/login')
//     }
// }

export const postLogin = passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login/failed'
})

export const postRegister = passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/register/failed'
})

export const getLogout = (req, res) => {
    req.logout(err => {
        if (err) {
            logger.error(err)
            throw err
        }
        else {
            res.status(200).send({ message: 'Logged out successfully' })
        }
    });
}
