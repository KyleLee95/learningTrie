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
  nodeType: {
    type: Sequelize.ENUM('Root', 'Core Concept', 'Sub-Concept')
  },
  type: {
    type: Sequelize.STRING
  },
  x: {
    type: Sequelize.FLOAT
  },
  y: {
    type: Sequelize.FLOAT
  }
})

module.exports = Node
