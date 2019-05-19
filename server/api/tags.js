const router = require('express').Router()
const {LearningTree, Tag} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const tags = await Tag.findAll()
    res.json(tags)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id)
    // console.log(Object.keys(tag.__proto__))
    const trees = await tag.getLearningTrees()
    console.log('get trees', trees.data)
    const learningTrees = await LearningTree.findAll({
      include: [
        {
          model: Tag,
          where: {id: req.params.id}
        }
      ]
    })
    res.json({
      someShit: trees,
      tag: tag,
      learningTrees: learningTrees
    })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id)
    const updatedTag = await tag.update({
      title: req.body.title
    })
    res.status(200).json(updatedTag)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Tag.destroy({
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
    const tag = await Tag.create({
      title: req.body.title
    })
    const learningTree = await LearningTree.findByPk(req.body.treeId)
    // console.log(Object.keys(learningTree.__proto__))
    // learningTree.setT(user)
    res.status(201).send(tag)
  } catch (err) {
    next(err)
  }
})
