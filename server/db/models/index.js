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
const Link = require('./link')
const Recommendation = require('./recommendation')
const ResourceTag = require('./resourceTag')
const Vote = require('./vote')
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

//User
User.belongsToMany(LearningTree, {through: 'userTree'})
User.belongsToMany(LearningTree, {through: 'favoriteTrees', as: 'favorite'})
User.belongsToMany(LearningTree, {through: 'canEdit', as: 'editor'})
User.belongsToMany(LearningTree, {through: 'canView', as: 'viewer'})
User.belongsToMany(LearningTree, {through: 'isMod', as: 'moderator'})
User.hasMany(Comment)
User.hasMany(Review)
User.belongsToMany(User, {as: 'followers', through: 'follower'})
User.belongsToMany(User, {as: 'following', through: 'isFollowing'})
User.hasMany(Message)
User.hasMany(Resource)
User.hasMany(Recommendation)
User.belongsToMany(Conversation, {as: 'sender', through: 'userConversation'})
User.belongsToMany(Conversation, {as: 'receiver', through: 'userConversation'})
User.hasMany(Vote)

//Learning Tree
LearningTree.belongsToMany(User, {through: 'userTree'})
LearningTree.belongsToMany(User, {through: 'favoriteTrees', as: 'favorite'})
// LearningTree.hasMany(User, {as: 'editor'})
// LearningTree.hasMany(User, {as: 'moderator'})
LearningTree.belongsToMany(User, {through: 'canEdit', as: 'editor'})
LearningTree.belongsToMany(User, {through: 'canView', as: 'viewer'})
LearningTree.belongsToMany(User, {through: 'isMod', as: 'moderator'})
LearningTree.hasMany(Review)
LearningTree.hasMany(Node)
LearningTree.hasMany(Node)
LearningTree.hasMany(Edge)
LearningTree.belongsToMany(Tag, {through: 'treeTag'})

//Comment
Comment.belongsTo(User)
Comment.belongsTo(Link)
Comment.belongsTo(Resource)
Comment.hasMany(Comment, {as: 'children'})
Comment.belongsTo(Comment, {as: 'parent'})

//Node
Node.belongsToMany(Resource, {through: 'nodeResource'})
// Node.belongsToMany(Resource, {through: 'nodeRecommendation'})
Node.belongsToMany(Recommendation, {through: 'nodeRecommendation'})
Node.belongsTo(LearningTree)
Node.belongsToMany(Edge, {through: 'nodeEdge'})

//Edge
Edge.belongsTo(LearningTree)
Edge.belongsToMany(Node, {through: 'nodeEdge'})

//Resource
Resource.belongsToMany(Node, {through: 'nodeResource'})
// Resource.belongsToMany(Node, {through: 'nodeResource', as: 'resource'})
Resource.belongsToMany(Link, {through: 'resourceLink'})
Resource.belongsToMany(User, {through: 'UserResource'})
// Resource.belongsToMany(Node, {
//   through: 'nodeRecommendation',
//   as: 'recommendation'
// })
Resource.hasMany(Comment)
Resource.belongsToMany(ResourceTag, {through: 'Tags for Resource'})
Resource.hasMany(Vote)

//Review
Review.belongsTo(User)
Review.belongsTo(LearningTree)

//Tag
Tag.belongsToMany(LearningTree, {through: 'treeTag'})

//Resource Tag
ResourceTag.belongsToMany(Resource, {through: 'Tags for Resource'})
ResourceTag.belongsToMany(Recommendation, {through: 'recommendationTag'})

//Conversation
Conversation.hasMany(Message)
Conversation.belongsToMany(User, {through: 'userConversation'})

//Link
Link.hasMany(Comment)
Link.belongsToMany(Resource, {through: 'resourceLink'})
Link.belongsToMany(Recommendation, {through: 'recommendationLink'})

//Recommendation
Recommendation.belongsToMany(User, {through: 'recommendedResources'})
Recommendation.belongsToMany(Link, {through: 'recommendationLink'})
Recommendation.belongsToMany(User, {through: 'userRecommendation'})
Recommendation.belongsToMany(Node, {through: 'nodeRecommendation'})
Recommendation.belongsToMany(ResourceTag, {through: 'recommendationTag'})
// Recommendation.hasMany(Vote)
//Message
Message.belongsTo(User)
Message.belongsTo(Conversation)

//Vote
Vote.belongsTo(User)

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
  Message,
  Link,
  Recommendation,
  ResourceTag,
  Vote
}
