import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TREES = 'GET_TREES'

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

/**
 * REDUCER
 */
export default function(state = defaultTrees, action) {
  switch (action.type) {
    case GET_TREES:
      console.log('reducer', action.trees)
      return action.trees
    default:
      return state
  }
}
