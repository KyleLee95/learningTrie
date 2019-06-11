const Sequelize = require('sequelize')
const db = require('../db')

const Conversation = db.define('conversation', {
  subject: {
    type: Sequelize.STRING
  },
  sender: {
    type: Sequelize.STRING,
    allowNull: false
  },
  receiver: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senderRead: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  receiverRead: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
})

module.exports = Conversation
