const Sequelize = require('sequelize')
const db = require('../db')

const LearningTree = db.define('learningTree', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  ownerId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = LearningTree
