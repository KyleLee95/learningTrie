const router = require('express').Router()
const {
  User,
  LearningTree,
  Review,
  Tag,
  Comment,
  Resource
} = require('../db/models')
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

//Associate a user as an owner of the learningTree
// console.log(Object.keys(tree.__proto__))
router.put('/isOwner', async (req, res, next) => {
  try {
    const tree = await LearningTree.findByPk(req.body.learningTreeId)
    const sanitizeEmail = req.body.email.toLowerCase()
    const user = await User.findOne({where: {email: sanitizeEmail}})
    await tree.addUser(user)
    res.status(200).send('success')
  } catch (err) {
    next(err)
  }
})

//Associate current user as a follower of another user
router.put('/follow/:id', async (req, res, next) => {
  // console.log(req.body)
  try {
    const user = await User.findAll({
      where: {id: req.user.id},
      include: [
        {
          model: LearningTree,
          include: [{model: Tag}, {model: User}, {model: Review}]
        },
        {
          model: Comment,
          include: [{model: Resource}]
        },
        {model: User, as: 'followers'},
        {model: User, as: 'following'}
      ]
    })
    let userToFollow = await User.findByPk(req.params.id)
    await user[0].addFollowing(userToFollow)
    await userToFollow.addFollower(user)
    userToFollow = await User.findAll({
      where: {id: req.params.id},
      include: [
        {
          model: LearningTree,
          include: [{model: Tag}, {model: User}, {model: Review}]
        },
        {
          model: Comment,
          include: [{model: Resource}]
        },
        {model: User, as: 'followers'},
        {model: User, as: 'following'}
      ]
    })
    res.status(200).send(userToFollow)
  } catch (err) {
    next(err)
  }
})

router.put('/unfollow/:id', async (req, res, next) => {
  try {
    const user = await User.findAll({
      where: {id: req.user.id},
      include: [
        {
          model: LearningTree,
          include: [{model: Tag}, {model: User}, {model: Review}]
        },
        {
          model: Comment,
          include: [{model: Resource}]
        },
        {model: User, as: 'followers'},
        {model: User, as: 'following'}
      ]
    })
    const userToUnfollow = await User.findByPk(req.body.userId)
    await user.removeFollowing(userToUnfollow)
    await userToUnfollow.removeFollower(user)
    res.status(200).send('success')
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: {id: req.params.id},
      include: [
        {
          model: LearningTree,
          include: [{model: Tag}, {model: User}, {model: Review}]
        },
        {
          model: Comment,
          include: [{model: Resource}]
        },
        {model: User, as: 'followers'},
        {model: User, as: 'following'}
      ]
    })
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
})
