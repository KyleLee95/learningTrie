'use strict'

const db = require('../server/db')
const {User, Node, Edge, LearningTree} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      firstName: 'cody',
      lastName: 'dog',
      email: 'cody@email.com',
      password: '123'
    }),
    User.create({
      firstName: 'murphy',
      lastName: 'dog',
      email: 'murphy@email.com',
      password: '123'
    })
  ])

  const learningTrees = await Promise.all([
    LearningTree.create({
      title: 'Machine Learning for Beginners',
      description:
        'The impetus of this whole project started because I wanted to learn Machine Learning on my own'
    }),
    LearningTree.create({
      title: 'Introduction to Philip Johnson & Machine Art',
      description: 'An Architect and Staff Member of MoMA'
    })
  ])

  await users[0].addLearningTree(learningTrees[0])
  await users[0].addLearningTree(learningTrees[1])
  console.log(`seeded ${learningTrees.length} learningTrees`)
  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
