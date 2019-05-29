const Sequelize = require('sequelize')
const db = require('../db')

const Conversation = db.define('conversation', {
  title: {
    type: Sequelize.STRING
  }
})

module.exports = Conversation
