const Sequelize = require('sequelize')
const db = require('../db')

const Conversation = db.define('conversation', {
  title: {
    type: Sequelize.STRING
  },
  sender: {
    type: Sequelize.STRING,
    allowNull: false
  },
  receiver: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Conversation
