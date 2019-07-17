const router = require('express').Router()
const {
  User,
  LearningTree,
  Tag,
  Review,
  ResourceTag,
  Resource,
  Vote
} = require('../db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = router

router.get('/search', async (req, res, next) => {
  try {
    //trees
    const trees = await LearningTree.findAll({
      include: [{model: Tag}, {model: Review}, {model: User}],
      where: {
        title: {[Op.iLike]: `%${req.query.search}%`}
      }
    })

    let treeTags = []
    const tag = await Tag.findOne({
      where: {title: {[Op.iLike]: `%${req.query.search}`}}
    })
    if (tag !== null) {
      treeTags = await tag.getLearningTrees({
        include: [{model: Tag}]
      })
    } else {
      treeTags = []
    }

    let treeArr = [...trees, ...treeTags]

    const uniqueTrees = Array.from(new Set(treeArr.map(a => a.id))).map(id => {
      return treeArr.find(a => a.id === id)
    })

    //resources

    const resources = await Resource.findAll({
      where: {title: {[Op.iLike]: `%${req.query.search}`}},
      include: [{model: ResourceTag}, {model: Vote}]
    })

    //users

    const users = await User.findAll({
      where: {dbUsername: {[Op.iLike]: `%${req.query.search}`}},
      include: [{model: User, as: 'followers'}, {model: User, as: 'following'}]
    })

    let search = {
      trees: uniqueTrees,
      resources: resources,
      users: users
    }

    res.status(200).json([search])
  } catch (err) {
    next(err)
  }
})

router.get('/myTrees/', async (req, res, next) => {
  try {
    const trees = await LearningTree.findAll({
      include: [{model: Tag}, {model: Review}, {model: User}],
      where: {ownerId: req.user.id}
    })

    res.status(200).json(trees)
  } catch (err) {
    next(err)
  }
})

router.get('/allTrees', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    const trees = await user.getLearningTrees({
      include: [{model: Tag}, {model: Review}, {model: User}]
    })
    const favoriteTrees = await user.getFavorite({
      include: [{model: Tag}, {model: Review}, {model: User}]
    })

    let treeArr = [...trees, ...favoriteTrees]

    const uniqueSet = Array.from(new Set(treeArr.map(a => a.id))).map(id => {
      return treeArr.find(a => a.id === id)
    })

    res.status(200).json(uniqueSet)
  } catch (err) {
    next(err)
  }
})

router.get('/favoriteTrees', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    const trees = await user.getFavorite({
      include: [{model: Tag}, {model: Review}, {model: User}]
    })
    res.status(200).json(trees)
  } catch (err) {
    next(err)
  }
})

router.get('/sharedWithMe', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    const trees = await user.getLearningTrees({
      include: [{model: Tag}, {model: Review}, {model: User}]
    })
    res.status(200).json(trees)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const tree = await LearningTree.findAll({
      where: {id: req.params.id},
      include: [
        {model: User},
        {model: Tag},
        {model: Review},
        {model: User, as: 'favorite'},
        {model: User, as: 'editor'},
        {model: User, as: 'viewer'},
        {model: User, as: 'moderator'}
      ]
    })
    res.status(200).json(tree)
  } catch (err) {
    next(err)
  }
})

//Associate a user as a collaborator of the learningTree

router.put('/addCollaborator', async (req, res, next) => {
  try {
    let tree = await LearningTree.findByPk(req.body.learningTreeId, {
      include: [{model: User, Tag, Review}]
    })
    const sanitizeUsername = req.body.username.toLowerCase()
    const user = await User.findOne({where: {dbUsername: sanitizeUsername}})
    await tree.addUser(user)
    if (req.body.permission === 'Viewer') {
      await tree.addViewer(user)
    }
    if (req.body.permission === 'Editor') {
      await tree.addEditor(user)
    }
    if (req.body.permission === 'Moderator') {
      await tree.addModerator(user)
    }
    tree = await LearningTree.findByPk(req.body.learningTreeId, {
      include: [
        {model: User},
        {model: User, as: 'favorite'},
        {model: User, as: 'editor'},
        {model: User, as: 'viewer'},
        {model: User, as: 'moderator'},
        {model: Tag},
        {model: Review}
      ]
    })
    res.status(200).send([tree])
  } catch (err) {
    next(err)
  }
})

//Unassociate a user as a collaborator of the learningTree

router.put('/removeCollaborator', async (req, res, next) => {
  try {
    let tree = await LearningTree.findByPk(req.body.learningTreeId, {
      include: [{model: User, Tag, Review}, {model: User, as: 'favorite'}]
    })
    const sanitizeUsername = req.body.username.toLowerCase()
    const user = await User.findOne({where: {dbUsername: sanitizeUsername}})
    await tree.removeUser(user)
    await tree.removeEditor(user)
    await tree.removeViewer(user)
    await tree.removeModerator(user)
    tree = await LearningTree.findByPk(req.body.learningTreeId, {
      include: [
        {model: User},
        {model: User, as: 'favorite'},
        {model: User, as: 'editor'},
        {model: User, as: 'viewer'},
        {model: User, as: 'moderator'},
        {model: Tag},
        {model: Review}
      ]
    })
    res.status(200).send([tree])
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const tree = await LearningTree.findByPk(req.params.id, {
      include: [
        {model: User},
        {model: Tag},
        {model: Review},
        {model: User, as: 'favorite'}
      ]
    })
    const updatedTree = await tree.update({
      title: req.body.title,
      description: req.body.description,
      isPrivate: req.body.private
    })
    req.body.tags.forEach(async tag => {
      let newTag = await Tag.findOrCreate({where: {title: tag}})
      await tree.addTag(newTag[0])
    })
    res.status(200).json(updatedTree)
  } catch (err) {
    next(err)
  }
})

router.delete('/removeFavorite/:learningTreeId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    let tree = await LearningTree.findByPk(req.params.learningTreeId, {
      include: [
        {model: User},
        {model: Tag},
        {model: Review},
        {model: User, as: 'favorite'}
      ]
    })

    await tree.removeFavorite(user)
    await user.removeFavorite(tree)
    tree = await LearningTree.findByPk(req.params.learningTreeId, {
      include: [
        {model: User},
        {model: Tag},
        {model: Review},
        {model: User, as: 'favorite'}
      ]
    })
    res.status(200).send([tree])
  } catch (err) {
    next(err)
  }
})
router.delete('/:id', async (req, res, next) => {
  try {
    await LearningTree.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).send(req.params.id)
  } catch (err) {
    next(err)
  }
})

router.post('/addFavorite', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    let tree = await LearningTree.findByPk(req.body.learningTreeId, {
      include: [
        {model: User},
        {model: Tag},
        {model: Review},
        {model: User, as: 'favorite'}
      ]
    })
    await tree.addFavorite(user)
    tree = await LearningTree.findByPk(req.body.learningTreeId, {
      include: [
        {model: User},
        {model: Tag},
        {model: Review},
        {model: User, as: 'favorite'}
      ]
    })
    await user.addFavorite(tree)
    res.status(200).send([tree])
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const learningTree = await LearningTree.create({
      title: req.body.title,
      description: req.body.description,
      isPrivate: req.body.isPrivate,
      ownerId: req.user.id
    })
    const user = await User.findByPk(req.user.id)
    await learningTree.addUser(user)
    req.body.tags.forEach(async tag => {
      let newTag = await Tag.findOrCreate({where: {title: tag}})
      await learningTree.addTag(newTag[0])
    })

    res.status(201).send({id: learningTree.id})
  } catch (err) {
    next(err)
  }
})
