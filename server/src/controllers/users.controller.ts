import { Request, Response } from 'express'
import passport from 'passport'

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
