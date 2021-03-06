const router = require('express').Router()
const {
  Resource,
  Node,
  LearningTree,
  User,
  Link,
  Comment,
  ResourceTag,
  Vote
} = require('../db/models')
const Op = require('sequelize').Op
module.exports = router

router.get('/user/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    const resource = user.getResource({
      include: [{model: ResourceTag}, {model: Vote}]
    })
    res.status(200).json(resource)
  } catch (err) {
    next(err)
  }
})

router.get('/search', async (req, res, next) => {
  try {
    let resource = []
    let resourcesTagged = []
    const resources = await Resource.findAll({
      where: {title: {[Op.iLike]: `%${req.query.search}%`}},
      include: [{model: ResourceTag}, {model: User}]
    })

    const resourceTag = await ResourceTag.findOne({
      where: {title: req.query.search}
    })
    if (resourceTag !== null) {
      resourcesTagged = await resourceTag.getResources({
        include: [{model: ResourceTag}, {model: User}]
      })
    } else {
      resourcesTagged = []
    }

    resource = [...resources, ...resourcesTagged]

    const uniqueResources = Array.from(new Set(resource.map(a => a.id))).map(
      id => {
        return resource.find(a => a.id === id)
      }
    )

    if (resource === undefined) {
      res.status(200).send({title: 'None Found'})
    } else {
      res.status(200).json(uniqueResources)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/link', async (req, res, next) => {
  try {
    const resource = await Resource.findAll({
      where: {link: req.query.link},
      include: [{model: ResourceTag}]
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

router.get('/', async (req, res, next) => {
  try {
    const resource = await Resource.findAll()
    res.status(200).json(resource)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    let resource = await Resource.findByPk(req.params.id, {
      include: [
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
        },
        {model: Link, through: 'resourceLink', include: [{model: Comment}]},
        {model: ResourceTag},
        {model: Vote}
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
    const resource = await Resource.findOrCreate({
      where: {
        title: req.body.title,
        link: req.body.link,
        description: req.body.description,
        type: req.body.type
      }
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

        await resource[0].addResourceTag(newTag[0])
      })
    } else {
      req.body.ResourceTags.forEach(async tag => {
        let newTag = await ResourceTag.findOrCreate({where: {title: tag.title}})
        await resource[0].addResourceTag(newTag[0])
      })
    }

    await resource[0].addNode(node)
    await node.addResource(resource[0])
    await resource[0].addUser(user)
    await user.addResource(resource[0])
    await link[0].addResource(resource[0])

    res.status(201).json(resource)
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
    const resources = await node.getResources({
      include: [
        {
          model: Vote
          // include: [{model: User}]
        }
      ]
    })
    res.status(200).json(resources)
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

    res.status(200).json(resource)
  } catch (err) {
    next(err)
  }
})

//gets the votes for a resource
router.put('/:nodeId', async (req, res, next) => {
  try {
    const node = await Node.findByPk(req.params.nodeId)
    //Search the resource for the current user. if they're included, send an upvote/downvote/none.

    const resource = await node.getResources({
      include: [
        {
          model: Vote
          // include: [{model: User}]
        }
      ]
    })
    res.status(200).json(resource)
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
    const resources = await node.getResources({
      include: [
        {
          model: Vote
          // include: [{model: User}]
        }
      ]
    })

    res.status(200).send(resources)
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
