const router = require('express').Router()
const {User, LearningTree, Review} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User
        },
        {model: LearningTree}
      ]
    })
    res.json(reviews)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id)
    res.json(review)
  } catch (err) {
    next(err)
  }
})

// router.put('/:id', async (req, res, next) => {
//   try {
//     const tree = await LearningTree.findByPk(req.params.id)
//     const updatedTree = await tree.update({
//       title: req.body.title,
//       description: req.body.description
//     })
//     res.status(200).json(updatedTree)
//   } catch (err) {
//     next(err)
//   }
// })

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
    const review = await Review.create({
      title: req.body.title,
      content: req.body.content,
      rating: req.body.rating
    })
    const user = await User.findByPk(req.user.id)
    const learningTree = await LearningTree.findByPk(req.body.treeId)
    await user.addReview(review)
    await learningTree.addReview(review)
    res.status(201).send(review)
  } catch (err) {
    next(err)
  }
})
