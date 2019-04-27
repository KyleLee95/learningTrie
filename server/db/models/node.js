const Sequelize = require('sequelize')
const db = require('../db')

const Node = db.define('node', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  type: {
    type: Sequelize.ENUM('Root', 'Core Concept', 'Sub-Concept')
  }
})

module.exports = Node
