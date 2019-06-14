import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_RESOURCES = 'GET_RESOURCES'
const REMOVE_RESOURCE = 'REMOVE_RESOURCE'
const UPDATE_RESOURCE = 'UPDATE_RESOURCE'
const CREATE_RESOURCE = 'CREATE_RESOURCE'
const SEARCH_RESOURCE_BY_LINK = 'SEARCH_RESOURCE_BY_LINK'

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
const fetchResourcesByLink = resource => ({
  type: SEARCH_RESOURCE_BY_LINK,
  resource
})
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

export const getResourceByLink = () => async dispatch => {
  try {
    const res = await axios.get(`/api/resources/link`)
    dispatch(fetchResourcesByLink(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delResource = resource => async dispatch => {
  try {
    const res = await axios.delete(`/api/resources/${resource.resource.id}`, {
      data: {resource: resource}
    })
    console.log(res.data)
    dispatch(removeResource(resource))
    history.push(`/learningTree/${res.data.learningTreeId}`)
  } catch (err) {
    console.error(err)
  }
}

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
    const res = await axios.put('/api/resources', resource)
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
      return []
    case UPDATE_RESOURCE:
      return action.resource
    case CREATE_RESOURCE:
      return [...state, action.resource]
    // case SEARCH_RESOURCE_BY_LINK:
    //   return action.resource
    default:
      return state
  }
}
