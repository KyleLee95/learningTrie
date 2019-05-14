import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_RESOURCES = 'GET_RESOURCES'
const REMOVE_RESOURCE = 'REMOVE_RESOURCE'
const UPDATE_RESOURCE = 'UPDATE_RESOURCE'
const CREATE_RESOURCE = 'CREATE_RESOURCE'

/**
 * INITIAL STATE
 */
const defaultResources = []

/**
 * ACTION CREATORS
 */
const fetchResources = resource => ({type: GET_RESOURCES, resource})
const removeResource = resource => ({type: REMOVE_RESOURCE, resource})
const createResouce = resource => ({type: CREATE_RESOURCE, resource})
const updateResource = resource => ({type: UPDATE_RESOURCE, resource})
/**
 * THUNK CREATORS
 */

export const getResources = () => async dispatch => {
  try {
    const res = await axios.get(`/api/resources/`)
    dispatch(fetchResources(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getSingleResource = resourceId => async dispatch => {
  try {
    const res = await axios.get(`/api/resources/${resourceId}`)
    dispatch(fetchResources(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delResource = resourceId => async dispatch => {
  try {
    await axios.delete(`/api/resources/${resourceId}`)
    dispatch(removeResource(resourceId))
  } catch (err) {
    console.error(err)
  }
}

// export const delSelectedEdge = edge => async dispatch => {
//   try {
//     await axios.delete(`/api/edges/${edge.id}`)
//     dispatch(removeEdge(edge))
//   } catch (err) {
//     console.error(err)
//   }
// }

export const postResource = resource => async dispatch => {
  try {
    const res = await axios.post('/api/resources', resource)
    dispatch(createResouce(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putResource = resource => async dispatch => {
  try {
    const res = await axios.put('/api/resourcess', resource)
    dispatch(updateResource(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultResources, action) {
  switch (action.type) {
    case GET_RESOURCES:
      return action.resource
    case REMOVE_RESOURCE:
      return state.filter(resource => resource.id !== action.resource)
    case UPDATE_RESOURCE:
      return [
        ...state.filter(edge => {
          return edge.id !== action.edge.id
        }),
        action.edge
      ]
    case CREATE_RESOURCE:
      return [...state, action.resource]
    default:
      return state
  }
}
