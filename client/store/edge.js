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

export const getEdges = treeId => async dispatch => {
  try {
    const res = await axios.get(`/api/edges/${treeId}`)
    dispatch(fetchEdges(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delEdge = edge => async dispatch => {
  try {
    await axios.delete(`/api/edges/${edge.id}`, {
      data: {foo: 'bar'}
    })
    dispatch(removeEdge(edge))
  } catch (err) {
    console.error(err)
  }
}

export const postEdge = edge => async dispatch => {
  try {
    const res = await axios.post('/api/edges', edge)
    dispatch(createEdge(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putEdge = edge => async dispatch => {
  try {
    const res = await axios.put('/api/edges', edge)
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
      return state.filter(edge => edge.id !== action.edge.id)
    case UPDATE_EDGE:
      return [
        ...state.filter(edge => {
          return edge.id !== action.edge.id
        }),
        action.edge
      ]
    case CREATE_EDGE:
      return [...state, action.edge]
    default:
      return state
  }
}
