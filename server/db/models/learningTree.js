const Sequelize = require('sequelize')
const db = require('../db')

const LearningTree = db.define('learningTree', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = LearningTree
