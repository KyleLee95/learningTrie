const User = require('./user')
const LearningTree = require('./learningTree')
const Review = require('./review')
const Comment = require('./comment')
const Resource = require('./resource')
const Node = require('./node')
const Edge = require('./edge')
const Tag = require('./tag')
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
LearningTree.hasMany(Review)
LearningTree.hasMany(Node, {as: 'node'})
LearningTree.belongsTo(User)
LearningTree.hasMany(Node)
LearningTree.hasMany(Edge)
LearningTree.belongsToMany(Tag, {through: 'treeTag'})
//Comment
Comment.belongsTo(LearningTree)
Comment.belongsTo(User)
Comment.belongsToMany(Resource, {through: 'resourceComment'})

//Node
// Node.hasMany(Node)
// Node.belongsToMany(Node, {as: 'child', through: 'ChildNode'})
Node.hasMany(Resource)
Node.belongsTo(LearningTree)
Node.hasMany(Edge, {onDelete: 'CASCADE'})

//Edge
Edge.belongsTo(LearningTree)
Edge.belongsToMany(Node, {through: 'nodeEdge'})

//Resource
Resource.belongsToMany(Node, {through: 'LearningResource'})
Resource.hasMany(Comment, {as: 'comment'})

//Review
Review.belongsTo(User)
Review.belongsTo(LearningTree)

//Tag
Tag.belongsToMany(LearningTree, {through: 'treeTag'})
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
  Node,
  Edge,
  Tag
}
