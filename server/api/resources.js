const router = require('express').Router()
const {
  Resource,
  Node,
  LearningTree,
  User,
  Link,
  Comment,
  ResourceTag
} = require('../db/models')
const Op = require('sequelize').Op
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const resource = await Resource.findAll()
    res.status(200).json(resource)
  } catch (err) {
    next(err)
  }
})

router.get('/link', async (req, res, next) => {
  try {
    const resource = await Resource.findAll({
      where: {link: req.query.link}
    })
    if (resource === undefined) {
      res.status(200).send({title: 'None Found'})
    } else {
      res.status(200).json(resource)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/search', async (req, res, next) => {
  try {
    let resource = []
    let resourcesTagged = []
    const resources = await Resource.findAll({
      where: {title: {[Op.iLike]: `%${req.query.search}%`}}
    })

    const resourceTag = await ResourceTag.findOne({
      where: {title: req.query.search}
    })
    if (resourceTag !== null) {
      resourcesTagged = await resourceTag.getResources()
    } else {
      resourcesTagged = []
    }

    // console.log(Object.keys(resourceTag.__proto__))

    resource = [...resources, ...resourcesTagged]
    if (resource === undefined) {
      res.status(200).send({title: 'None Found'})
    } else {
      res.status(200).json(resource)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [
        {model: Link, through: 'resourceLink', include: [{model: Comment}]},
        {model: ResourceTag}
      ]
    })

    res.status(200).json(resource)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    //conditionally create resources
    let resource = await Resource.create({
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
    if (req.body.tags) {
      req.body.tags.forEach(async tag => {
        let newTag = await ResourceTag.findOrCreate({where: {title: tag}})
        await resource.addResourceTag(newTag[0])
      })
    } else {
      req.body.ResourceTags.forEach(async tag => {
        let newTag = await ResourceTag.findOrCreate({where: {title: tag.title}})
        await resource.addResourceTag(newTag[0])
      })
    }

    await resource.addNode(node)
    await node.addResource(resource)
    await resource.addUser(user)
    await user.addResource(resource)
    await link[0].addResource(resource)

    res.status(201).json(resource)
  } catch (err) {
    next(err)
  }
})

//Adds the resources to the node from the search menu of existing resources
router.post('/add', async (req, res, next) => {
  try {
    const node = await Node.findByPk(req.body.node.id)
    const resource = await Resource.findByPk(req.body.resource.id)

    await resource.addNode(node)
    await node.addResource(resource)
    res.status(200).send('success')
  } catch (err) {
    next(err)
  }
})

//removes resource from the selected node but does not delete

router.put('/remove', async (req, res, next) => {
  try {
    const node = await Node.findByPk(req.body.node.id)
    const resource = await Resource.findByPk(req.body.resource.id)
    await node.removeResource(resource)
    await resource.removeNode(node)
    res.status(200).send('success')
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.body.id)
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
