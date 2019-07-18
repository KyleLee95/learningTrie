const router = require('express').Router()
const {
  User,
  LearningTree,
  Review,
  Tag,
  Comment,
  Resource,
  ResourceTag,
  Link,
  Vote
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
      include: [
        {model: LearningTree, include: [{model: Review}]},
        {model: Resource}
      ]
    })

    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/admin', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'username', 'rank']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

//Associate current user as a follower of another user
router.put('/follow/:id', async (req, res, next) => {
  // console.log(req.body)
  try {
    const user = await User.findAll({
      where: {id: req.user.id}
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
          include: [
            {
              model: Link,
              include: [{model: Resource}, {model: Comment}]
            },
            {model: Resource}
          ]
        },
        {model: User, as: 'followers'},
        {model: User, as: 'following'},
        {model: Resource, include: [{model: Link}]}
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
          include: [
            {
              model: Link,
              include: [{model: Resource}, {model: Comment}]
            },
            {model: Resource}
          ]
        },
        {model: User, as: 'followers'},
        {model: User, as: 'following'},
        {model: Resource, include: [{model: Link}]}
      ]
    })

    let userToUnfollow = await User.findByPk(req.params.id)
    await user[0].removeFollowing(userToUnfollow)
    await userToUnfollow.removeFollower(user)
    userToUnfollow = await User.findAll({
      where: {id: req.params.id},
      include: [
        {
          model: LearningTree,
          include: [{model: Tag}, {model: User}, {model: Review}]
        },
        {
          model: Comment,
          include: [
            {
              model: Link,
              include: [{model: Resource}, {model: Comment}]
            },
            {model: Resource}
          ]
        },
        {model: User, as: 'followers'},
        {model: User, as: 'following'},
        {model: Resource, include: [{model: Link}]}
      ]
    })
    res.status(200).json(userToUnfollow)
  } catch (err) {
    next(err)
  }
})

router.put('/update/:id', async (req, res, next) => {
  try {
    const users = await User.findByPk(req.params.id)

    await users.update({
      bio: req.body.bio
    })

    res.send([users])
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
          include: [
            {
              model: Link,
              include: [{model: Resource}, {model: Comment}]
            },
            {model: Resource}
          ]
        },
        {model: User, as: 'followers'},
        {model: User, as: 'following'},
        {
          model: Resource,
          include: [
            {model: Link, include: [{model: Comment}]},
            {model: Vote},
            {model: ResourceTag}
          ]
        }
      ]
    })
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
})
