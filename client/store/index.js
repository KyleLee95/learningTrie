import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import currUser from './currentUser'
import tree from './learningTree'
import edge from './edge'
import node from './node'
import resource from './resource'
import review from './review'
import tag from './tag'
import comment from './comment'
import users from './user'
import link from './link'
import recommendation from './recommendation'
import conversation from './conversation'
const reducer = combineReducers({
  currUser,
  users,
  tree,
  edge,
  node,
  resource,
  review,
  tag,
  comment,
  link,
  recommendation,
  conversation
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './currentUser'
export * from './learningTree'
export * from './edge'
export * from './node'
export * from './resource'
export * from './review'
export * from './tag'
export * from './comment'
export * from './user'
export * from './link'
export * from './recommendation'
export * from './conversation'
