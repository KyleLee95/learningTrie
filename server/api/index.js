const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/learningTrees', require('./learningTrees'))
router.use('/nodes', require('./nodes'))
router.use('/edges', require('./edges'))
router.use('/resources', require('./resources'))
router.use('/reviews', require('./reviews'))
router.use('/tags', require('./tags'))
router.use('/comments', require('./comments'))
router.use('/message', require('./message'))
router.use('/conversation', require('./conversation'))
router.use('/links', require('./links'))
router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
