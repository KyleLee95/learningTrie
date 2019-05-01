const Sequelize = require('sequelize')
const db = require('../db')

const Edge = db.define('edge', {
  source: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  target: {
    type: Sequelize.INTEGER
  },
  type: {
    type: Sequelize.STRING,
    defaultValue: 'emptyEdge'
  }
})

module.exports = Edge
