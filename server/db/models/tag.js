const Sequelize = require('sequelize')
const db = require('../db')

const Tag = db.define('tag', {
  title: {
    type: Sequelize.STRING
  }
})

module.exports = Tag
