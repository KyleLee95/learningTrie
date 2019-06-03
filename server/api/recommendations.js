const router = require('express').Router()
const {
  Resource,
  Recommendation,
  Node,
  LearningTree,
  User,
  Link
} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findAll()
    res.status(200).json(recommendation)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findByPk(req.params.id, {
      include: [{model: Link, through: 'recommendationLink'}]
    })
    // console.log(Object.keys(resource.__proto__))
    res.status(200).json(recommendation)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    //conditionally create resources
    console.log('req.body', req.body)
    let recommendation = await Recommendation.create({
      title: req.body.title,
      link: req.body.link,
      description: req.body.description,
      type: req.body.type
    })
    const shortUrl = req.body.link
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
      .split('/')[0]
    const link = await Link.findOrCreate({
      where: {url: req.body.link, shortUrl: shortUrl}
    })
    const user = await User.findByPk(Number(req.user.id))
    const node = await Node.findByPk(req.body.nodeId)
    await link[0].addRecommendation(recommendation)
    await recommendation.addNode(node)
    await recommendation.addUser(user)
    // await resource.setResourceLink(link[0])
    await user.addRecommendation(recommendation)
    await node.addRecommendation(recommendation)

    res.status(201).json(recommendation)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.body.id)
    console.log(req.body.type)
    await resource.update({
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      type: req.body.type
    })

    res.status(200).json(resource)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const node = await Node.findByPk(req.body.resource.resource.nodeId, {
      include: [{model: LearningTree}]
    })
    await Resource.destroy({
      where: {
        id: req.params.id
      }
    })

    res.status(200).json(node)
  } catch (err) {
    next(err)
  }
})
