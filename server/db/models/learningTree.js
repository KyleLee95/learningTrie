const Sequelize = require('sequelize')
const db = require('../db')

const LearningTree = db.define('learning tree', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  }
})

module.exports = LearningTree
