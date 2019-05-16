const Sequelize = require('sequelize')
const db = require('../db')

const Edge = db.define('edge', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  source: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  target: {
    type: Sequelize.BIGINT
  },
  type: {
    type: Sequelize.STRING,
    defaultValue: 'emptyEdge'
  }
})

module.exports = Edge
