const User = require('./user')
const LearningTree = require('./learningTree')
const Review = require('./review')
const Comment = require('./comment')
const Resource = require('./resource')
const Node = require('./node')
const Edge = require('./edge')
const Tag = require('./tag')
const Message = require('./message')
const Conversation = require('./conversation')
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

//User
User.belongsToMany(LearningTree, {through: 'userTree'})
User.hasMany(Comment)
User.hasMany(Review)
User.belongsToMany(User, {as: 'followers', through: 'follower'})
User.belongsToMany(User, {as: 'following', through: 'isFollowing'})
User.belongsToMany(Conversation, {through: 'userConversation'})
User.hasMany(Message)

//Learning Tree
LearningTree.hasMany(Review)
LearningTree.hasMany(Node)
LearningTree.belongsToMany(User, {through: 'userTree'})
LearningTree.hasMany(Node)
LearningTree.hasMany(Edge)
LearningTree.belongsToMany(Tag, {through: 'treeTag'})

//Comment
Comment.belongsTo(LearningTree)
Comment.belongsTo(User)
Comment.belongsToMany(Resource, {through: 'resourceComment'})

//Node
Node.hasMany(Resource)
Node.belongsTo(LearningTree)
Node.belongsToMany(Edge, {through: 'nodeEdge'})

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

//Conversation
Conversation.hasMany(Message)
Conversation.belongsToMany(User, {through: 'userConversation'})

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
  Tag,
  Conversation,
  Message
}
