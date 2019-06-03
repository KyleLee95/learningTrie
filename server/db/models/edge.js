const Sequelize = require('sequelize')
const db = require('../db')

const Edge = db.define('edge', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  source: {
    type: Sequelize.UUID,
    allowNull: false
  },
  target: {
    type: Sequelize.UUID
  },
  type: {
    type: Sequelize.STRING,
    defaultValue: 'emptyEdge'
  },
  handleText: {
    type: Sequelize.STRING,
    defaultValue: 'Double click to edit'
  }
})

module.exports = Edge
