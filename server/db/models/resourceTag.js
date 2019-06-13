const Sequelize = require('sequelize')
const db = require('../db')

const ResourceTag = db.define('ResourceTag', {
  title: {
    type: Sequelize.STRING
  }
})

module.exports = ResourceTag
