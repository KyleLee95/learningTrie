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
      password: '123',
      username: 'codyDog',
      bio:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor leo ac sem pulvinar viverra. Suspendisse interdum pharetra erat vel ornare. Donec dui orci, molestie at dolor ac, volutpat facilisis quam. Fusce scelerisque dui libero, nec laoreet mauris viverra vel. Quisque pretium imperdiet ante id rhoncus. Sed vitae volutpat lacus, vel accumsan nulla. Morbi elementum dui vitae tristique cursus. Nulla maximus dui et tellus pulvinar, sed varius velit mattis. Ut viverra ante ligula, vel viverra urna faucibus sed. Etiam ut turpis finibus, imperdiet augue vitae, auctor erat. Aliquam gravida neque quis est aliquam, ac iaculis sem vulputate. Nulla condimentum in sem quis placerat. Suspendisse facilisis arcu eu odio aliquet, sed interdum diam hendrerit. Nullam in consectetur metus.',
      isAdmin: true
    }),
    User.create({
      firstName: 'murphy',
      lastName: 'dog',
      email: 'murphy@email.com',
      password: '123',
      username: 'murphyDog',
      bio:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor leo ac sem pulvinar viverra. Suspendisse interdum pharetra erat vel ornare. Donec dui orci, molestie at dolor ac, volutpat facilisis quam. Fusce scelerisque dui libero, nec laoreet mauris viverra vel. Quisque pretium imperdiet ante id rhoncus. Sed vitae volutpat lacus, vel accumsan nulla. Morbi elementum dui vitae tristique cursus. Nulla maximus dui et tellus pulvinar, sed varius velit mattis. Ut viverra ante ligula, vel viverra urna faucibus sed. Etiam ut turpis finibus, imperdiet augue vitae, auctor erat. Aliquam gravida neque quis est aliquam, ac iaculis sem vulputate. Nulla condimentum in sem quis placerat. Suspendisse facilisis arcu eu odio aliquet, sed interdum diam hendrerit. Nullam in consectetur metus.',
      isAdmin: false
    }),
    User.create({
      firstName: 'kyle',
      lastName: 'lee',
      email: 'kyle@email.com',
      password: '123',
      username: 'mangoHi_Chew',
      bio:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor leo ac sem pulvinar viverra. Suspendisse interdum pharetra erat vel ornare. Donec dui orci, molestie at dolor ac, volutpat facilisis quam. Fusce scelerisque dui libero, nec laoreet mauris viverra vel. Quisque pretium imperdiet ante id rhoncus. Sed vitae volutpat lacus, vel accumsan nulla. Morbi elementum dui vitae tristique cursus. Nulla maximus dui et tellus pulvinar, sed varius velit mattis. Ut viverra ante ligula, vel viverra urna faucibus sed. Etiam ut turpis finibus, imperdiet augue vitae, auctor erat. Aliquam gravida neque quis est aliquam, ac iaculis sem vulputate. Nulla condimentum in sem quis placerat. Suspendisse facilisis arcu eu odio aliquet, sed interdum diam hendrerit. Nullam in consectetur metus.',
      isAdmin: false
    }),
    User.create({
      firstName: 'Mat Lam Tam',
      lastName: 'FSA',
      email: 'mlt@email.com',
      password: '123',
      username: 'MatLamTam',
      bio:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce porttitor leo ac sem pulvinar viverra. Suspendisse interdum pharetra erat vel ornare. Donec dui orci, molestie at dolor ac, volutpat facilisis quam. Fusce scelerisque dui libero, nec laoreet mauris viverra vel. Quisque pretium imperdiet ante id rhoncus. Sed vitae volutpat lacus, vel accumsan nulla. Morbi elementum dui vitae tristique cursus. Nulla maximus dui et tellus pulvinar, sed varius velit mattis. Ut viverra ante ligula, vel viverra urna faucibus sed. Etiam ut turpis finibus, imperdiet augue vitae, auctor erat. Aliquam gravida neque quis est aliquam, ac iaculis sem vulputate. Nulla condimentum in sem quis placerat. Suspendisse facilisis arcu eu odio aliquet, sed interdum diam hendrerit. Nullam in consectetur metus.',
      isAdmin: false
    })
  ])

  const learningTrees = await Promise.all([
    LearningTree.create({
      title: 'Machine Learning for Beginners',
      description: 'The impetus of this whole project',
      ownerId: 1
    }),
    LearningTree.create({
      title: 'Introduction to Philip Johnson & Machine Art',
      description: 'An Architect and Staff Member of MoMA',
      ownerId: 2
    })
  ])

  console.log('USER', Object.keys(users[0].__proto__))
  console.log('LEARNING TREE', Object.keys(learningTrees[0].__proto__))

  await users[0].addLearningTree(learningTrees[0])
  await users[1].addLearningTree(learningTrees[1])
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
