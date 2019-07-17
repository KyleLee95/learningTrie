const router = require('express').Router()
const {
  Resource,
  ResourceTag,
  Recommendation,
  Node,
  LearningTree,
  User,
  Link
} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findAll({
      include: [{model: ResourceTag}]
    })
    res.status(200).json(recommendation)
  } catch (err) {
    next(err)
  }
})

router.get('/node/:id', async (req, res, next) => {
  try {
    const node = await Node.findByPk(req.params.id)
    const recommendations = await node.getRecommendations({
      include: [{model: ResourceTag}, {model: User}]
    })
    res.status(200).json(recommendations)
  } catch (err) {
    next(err)
  }
})
router.get('/:id', async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findByPk(req.params.id, {
      include: [
        {model: ResourceTag},
        {
          model: Node,
          include: [
            {
              model: LearningTree,
              include: [
                {model: User, as: 'editor'},
                {model: User, as: 'moderator'}
              ]
            }
          ]
        }
      ]
    })

    // console.log(Object.keys(resource.__proto__))
    res.status(200).json([recommendation])
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    //create resource for indexing
    const user = await User.findByPk(Number(req.user.id))
    const node = await Node.findByPk(req.body.nodeId)
    const resource = await Resource.findOrCreate({
      where: {
        title: req.body.title,
        link: req.body.link,
        description: req.body.description,
        type: req.body.type
      }
    })
    //conditionally create recommendation
    let recommendation = await Recommendation.findOrCreate({
      where: {
        title: req.body.title,
        link: req.body.link,
        description: req.body.description,
        type: req.body.type,
        ownerId: req.body.ownerId,
        owner: user.username
      }
    })

    await recommendation[0].update({
      score: resource[0].score
    })

    const shortUrl = req.body.link
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
      .split('/')[0]
    const link = await Link.findOrCreate({
      where: {url: req.body.link, shortUrl: shortUrl}
    })

    if (req.body.tags) {
      req.body.tags.forEach(async tag => {
        let newTag = await ResourceTag.findOrCreate({where: {title: tag}})
        await resource[0].addResourceTag(newTag[0])
        await recommendation[0].addResourceTag(newTag[0])
      })
    } else {
      req.body.ResourceTags.forEach(async tag => {
        let newTag = await ResourceTag.findOrCreate({where: {title: tag.title}})
        await recommendation[0].addResourceTag(newTag[0])
        await resource[0].addResourceTag(newTag[0])
      })
    }

    await link[0].addRecommendation(recommendation[0])
    await link[0].addResource(resource[0])
    await recommendation[0].addLink(link[0])
    await recommendation[0].addNode(node)
    await recommendation[0].addUser(user)
    await user.addRecommendation(recommendation[0])
    await node.addRecommendation(recommendation[0])
    await resource[0].addLink(link[0])

    res.status(201).json(recommendation[0])
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findByPk(req.body.id)
    await recommendation.update({
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      type: req.body.type
    })

    res.status(200).json(recommendation)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Recommendation.destroy({
      where: {
        id: req.params.id
      }
    })

    res.status(200).json(req.params.id)
  } catch (err) {
    next(err)
  }
})
