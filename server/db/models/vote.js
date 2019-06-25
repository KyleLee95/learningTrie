const Sequelize = require('sequelize')
const db = require('../db')

const Vote = db.define('vote', {
  vote: {
    type: Sequelize.ENUM,
    values: ['upvote', 'downvote', 'none']
  }
})

module.exports = Vote
