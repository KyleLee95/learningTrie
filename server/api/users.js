const router = require('express').Router()
const {User, LearningTree, Review} = require('../db/models')
module.exports = router
//da fuq am I using this for? I think this ileftover from boilerplate lmao. probably delete this at some poiint but I'm too afraid to.
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email'],
      include: [{model: LearningTree, include: [{model: Review}]}]
    })

    res.json(users)
  } catch (err) {
    next(err)
  }
})
