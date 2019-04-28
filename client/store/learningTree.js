import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TREES = 'GET_TREES'
const SET_SELECTED_TREE = 'SET_SELETED_TREE'

/**
 * INITIAL STATE
 */
const defaultTrees = {}

/**
 * ACTION CREATORS
 */
const getTrees = trees => ({
  type: GET_TREES,
  trees
})

const setSelectedTree = trees => ({
  type: SET_SELECTED_TREE,
  trees
})

/**
 * THUNK CREATORS
 */
export const fetchTrees = () => async dispatch => {
  try {
    const res = await axios.get('/api/learningTrees')
    return dispatch(getTrees(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const fetchSelectedTree = treeId => async dispatch => {
  try {
    const res = await axios.get(`/api/learningTrees/${treeId}`)
    return dispatch(setSelectedTree(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultTrees, action) {
  switch (action.type) {
    case GET_TREES:
      return action.trees
    case SET_SELECTED_TREE:
      return {...state, selectedTree: action.trees}
    default:
      return state
  }
}
