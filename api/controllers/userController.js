const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');




const generateJwt = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.SECRET_KEY,
    { expiresIn: "1h" })
}
class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, role } = req.body
      if (!email || !password) {
        return next(ApiError.badRequest('Invalid password or email'))
      }
      const candidat = await User.findOne({ where: { email } })
      if (candidat) {
        return next(ApiError.badRequest('This email address is busy by another user'))
      }
      const hashPassword = await bcrypt.hash(password, 4)
      const user = await User.create({ email, role, password: hashPassword })
      const basket = await Basket.create({ userId: user.id })
      const token = generateJwt(
        user.id,
        user.email,
        user.role
      )
      return res.json({ token })
    } catch (error) {
      console.error(`error=>`, error)
    }
  }
  async login(req, res, next) {
    const { email, password } = req.body
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return next(ApiError.internal('There is no user with this email'))
      }
      let comparePassword = bcrypt.compareSync(password, user.password)
      if (!comparePassword) {
        return next(ApiError.internal('Wrong password'))
      }
      const token = generateJwt(user.id, user.email, user.role)
      res.json({ token })

    } catch (error) {
      console.log('user=>', user);
      console.log(`error =>`, error)
    }
  }
  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role)
    res.json({ token })
  }
}

module.exports = new UserController()