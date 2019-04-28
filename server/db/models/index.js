const User = require('./user')
const LearningTree = require('./learningTree')
const Review = require('./review')
const Comment = require('./comment')
const Resource = require('./resource')
const Node = require('./node')
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

//User
User.hasMany(LearningTree, {foreignKey: 'userId'})
User.hasMany(Comment)
User.hasMany(Review)

//Learning Tree
LearningTree.hasMany(Review, {as: 'review'})
LearningTree.hasMany(Node, {as: 'node'})
LearningTree.belongsTo(User)

//Comment
Comment.belongsTo(LearningTree)
Comment.belongsTo(User)
Comment.belongsTo(Resource)

//Node
Node.hasMany(Node)
Node.belongsToMany(Node, {as: 'child', through: 'ChildNode'})
Node.hasMany(Resource)

//Resource
Resource.belongsToMany(Node, {through: 'LearningResource'})
Resource.hasMany(Comment, {as: 'comment'})

//Review
Review.belongsTo(User)
/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Resource,
  Comment,
  LearningTree,
  Review,
  Node
}
