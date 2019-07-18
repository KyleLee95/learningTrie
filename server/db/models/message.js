const Sequelize = require('sequelize')
const db = require('../db')

const Message = db.define('message', {
  content: {
    type: Sequelize.TEXT
  },
  messageType: {
    type: Sequelize.STRING,
    defaultValue: 'message'
  },
  tree: {
    type: Sequelize.STRING
  },
  treeId: {
    type: Sequelize.STRING
  },
  resource: {
    type: Sequelize.STRING
  },
  resourceId: {
    type: Sequelize.STRING
  },
  recommendation: {
    type: Sequelize.STRING
  },
  recommendationId: {
    type: Sequelize.STRING
  }
})

module.exports = Message
