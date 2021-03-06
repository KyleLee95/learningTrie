const router = require('express').Router()
const {User, LearningTree, Review, Tag} = require('../db/models')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {email: req.body.email},
      include: [{model: LearningTree, include: [{model: Tag}]}]
    })
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.put('/checkMail', async (req, res, next) => {
  try {
    let user = await User.findByPk(req.user.id)
    await user.update({newMessage: false})
    user = await User.findByPk(req.user.id)
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', async (req, res) => {
  const users = await User.findByPk(req.user.id, {
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: [
      'avatar',
      'id',
      'email',
      'firstName',
      'lastName',
      'username',
      'bio',
      'newMessage',
      'rank'
    ],
    include: [
      {
        model: LearningTree,
        include: [{model: Review}, {model: Tag}, {model: User}]
      }
    ]
  })
  res.json(users)
})

router.use('/google', require('./google'))
