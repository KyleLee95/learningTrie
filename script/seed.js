'use strict'

const db = require('../server/db')
const {User, Node, Edge, LearningTree} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])

  // const nodes = await Promise.all([
  //   Node.create({
  //     id: 1,
  //     title: 'Node A',
  //     x: 258.3976135253906,
  //     y: 331.9783248901367,
  //     type: 'empty'
  //   }),
  //   Node.create({
  //     id: 2,
  //     title: 'Node B',
  //     x: 593.9393920898438,
  //     y: 260.6060791015625,
  //     type: 'empty'
  //   }),
  //   Node.create({
  //     id: 3,
  //     title: 'Node C',
  //     x: 237.5757598876953,
  //     y: 61.81818389892578,
  //     type: 'custom'
  //   }),
  //   Node.create({
  //     id: 4,
  //     title: 'Node C',
  //     x: 600.5757598876953,
  //     y: 600.81818389892578,
  //     type: 'custom'
  //   })
  // ])
  // const edges = await Promise.all([
  //   Edge.create({
  //     source: 1,
  //     target: 4,
  //     type: 'emptyEdge'
  //   }),
  //   Edge.create({
  //     source: 2,
  //     target: 4,
  //     type: 'emptyEdge'
  //   })
  // ])

  const learningTrees = await Promise.all([
    LearningTree.create({
      title: 'Machine Learning for Beginners',
      description:
        'The impetus of this whole project started because I wanted to learn Machine Learning on my own'
    })
  ])

  // console.log(Object.keys(learningTrees[0].__proto__))
  // await learningTrees[0].addNode(nodes[0])
  // await learningTrees[0].addNode(nodes[1])
  // await learningTrees[0].addNode(nodes[2])
  // await learningTrees[0].addNode(nodes[3])
  // await learningTrees[0].addEdge(edges[0])
  // await learningTrees[0].addEdge(edges[1])
  await users[0].addLearningTree(learningTrees[0])
  console.log(`seeded ${learningTrees.length} learningTrees`)
  console.log(`seeded ${users.length} users`)
  // console.log(`seeded ${nodes.length} nodes`)
  // console.log(`seeded ${edges.length} edges`)
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
