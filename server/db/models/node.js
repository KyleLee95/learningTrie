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
  },
  nodeType: {
    type: Sequelize.STRING,
    defaultValue: 'empty'
  },
  x: {
    type: Sequelize.FLOAT,
    defaultValue: 377.367431640625
  },
  y: {
    type: Sequelize.FLOAT,
    defaultValue: 397.5807800292969
  }
})

module.exports = Node
