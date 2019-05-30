const router = require('express').Router()
const {Resource, Node, LearningTree, User, Link} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id)
    const link = await resource.getLinks()

    // const link = linksArr[0]
    // console.log(Object.keys(resource.__proto__))
    // console.log(link)
    // const link = await Link.findOne({
    //   where: {
    //     url: req.param.
    //   }
    // })
    console.log('A')
    res.status(200).json(link)
  } catch (err) {
    next(err)
  }
})
