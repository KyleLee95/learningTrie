const router = require('express').Router()
const {User, LearningTree, Tag, Review} = require('../db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = router

router.get('/myTrees', async (req, res, next) => {
  try {
    const trees = await LearningTree.findAll({
      include: [{model: Tag}, {model: Review}, {model: User}]
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

    // const trees = await LearningTree.findAll({
    //   include: [{model: Tag}, {model: Review}, {model: User}]
    // })

    res.status(200).json(trees)
  } catch (err) {
    next(err)
  }
})

router.get('/search', async (req, res, next) => {
  try {
    const trees = await LearningTree.findAll({
      include: [{model: Tag}, {model: Review}, {model: User}],
      where: {
        title: {[Op.iLike]: `%${req.query.search}%`}
      }
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
      include: [{model: User}]
    })
    res.status(200).json(tree)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const tree = await LearningTree.findByPk(req.params.id)
    const updatedTree = await tree.update({
      title: req.body.title,
      description: req.body.description
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

router.post('/', async (req, res, next) => {
  try {
    const learningTree = await LearningTree.create({
      title: req.body.title,
      description: req.body.description,
      ownerId: req.user.id
    })
    const user = await User.findByPk(req.user.id)
    // console.log(Object.keys(learningTree.__proto__))
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
