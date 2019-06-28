const Sequelize = require('sequelize')
const db = require('../db')

const Vote = db.define('vote', {
  voteType: {
    type: Sequelize.ENUM('upvote', 'downvote', 'none'),
    defaultValue: 'none'
  }
})

module.exports = Vote
