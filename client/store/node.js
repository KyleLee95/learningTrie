import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_NODES = 'GET_NODES'
const REMOVE_NODE = 'REMOVE_NODE'
const UPDATE_NODE = 'UPDATE_NODE'
const CREATE_NODE = 'CREATE_NODE'

/**
 * INITIAL STATE
 */
const defaultNodes = []

/**
 * ACTION CREATORS
 */
const fetchNodes = node => ({type: GET_NODES, node})
const removeNode = node => ({type: REMOVE_NODE, node})
const createNode = node => ({type: CREATE_NODE, node})
const updateNode = node => ({type: UPDATE_NODE, node})
/**
 * THUNK CREATORS
 */

export const getNodes = treeId => async dispatch => {
  try {
    const res = await axios.get(`/api/nodes/${treeId}`)
    dispatch(fetchNodes(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delNode = node => async dispatch => {
  try {
    await axios.delete(`/api/nodes/${node.id}`, {data: {node: node}})
    dispatch(removeNode(node))
  } catch (err) {
    console.error(err)
  }
}

export const postNode = node => async dispatch => {
  try {
    const res = await axios.post('/api/nodes', node)
    dispatch(createNode(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putNode = node => async dispatch => {
  try {
    const res = await axios.put('/api/nodes', node)
    dispatch(updateNode(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultNodes, action) {
  switch (action.type) {
    case GET_NODES:
      return action.node
    case REMOVE_NODE:
      return state.filter(node => node.id !== action.node.id)
    case UPDATE_NODE:
      return [
        ...state.filter(node => {
          return node.id !== action.node.id
        }),
        action.node
      ]
    case CREATE_NODE:
      return [...state, action.node]
    default:
      return state
  }
}
