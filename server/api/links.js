const router = require('express').Router()
const {Resource, Node, LearningTree, User, Link} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id)
    const link = await resource.getLinks()
    console.log(Object.keys(resource.__proto__))

    // const link = await Link.findOne({
    //   where: {
    //     url: req.param.
    //   }
    // })
    res.status(200).json(link)
  } catch (err) {
    next(err)
  }
})
