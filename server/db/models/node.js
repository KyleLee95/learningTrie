const Sequelize = require('sequelize')
const db = require('../db')
// const DataTypes = require('sequelize').DataTypes
const Node = db.define('node', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  question: {
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
