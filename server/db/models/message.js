const Sequelize = require('sequelize')
const db = require('../db')

const Message = db.define('message', {
  content: {
    type: Sequelize.TEXT
  }
})

module.exports = Message
