import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import tree from './learningTree'
import edge from './edge'
import node from './node'
import resource from './resource'
import review from './review'
import tag from './tag'
const reducer = combineReducers({
  user,
  tree,
  edge,
  node,
  resource,
  review,
  tag
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './learningTree'
export * from './edge'
export * from './node'
export * from './resource'
export * from './review'
export * from './tag'
