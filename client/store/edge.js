import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_EDGES = 'GET_EDGES'
const REMOVE_EDGE = 'REMOVE_EDGE'
const UPDATE_EDGE = 'UPDATE_EDGE'
const CREATE_EDGE = 'CREATE_EDGE'

/**
 * INITIAL STATE
 */
const defaultEdges = []

/**
 * ACTION CREATORS
 */
const fetchEdges = edge => ({type: GET_EDGES, edge})
const removeEdge = edge => ({type: REMOVE_EDGE, edge})
const createEdge = edge => ({type: CREATE_EDGE, edge})
const updateEdge = edge => ({type: UPDATE_EDGE, edge})
/**
 * THUNK CREATORS
 */

export const getEdges = () => async dispatch => {
  try {
    const res = await axios.get('/api/Edges')
    dispatch(fetchEdges(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delEdge = edgeId => async dispatch => {
  try {
    await axios.delete('/api/Edges', edgeId)
    dispatch(removeEdge(edgeId))
  } catch (err) {
    console.error(err)
  }
}

export const postEdge = edge => async dispatch => {
  try {
    const res = await axios.post('/api/Edges', edge)
    dispatch(createEdge(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putEdge = edge => async dispatch => {
  try {
    const res = await axios.put('/api/Edges', edge)
    dispatch(updateEdge(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultEdges, action) {
  switch (action.type) {
    case GET_EDGES:
      return action.edge
    case REMOVE_EDGE:
      return state
    case UPDATE_EDGE:
      return action.edge
    case CREATE_EDGE:
      return action.edge
    default:
      return state
  }
}
