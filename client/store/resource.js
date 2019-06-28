/* eslint-disable complexity*/
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
const ASSOCIATE_RESOURCE_TO_NODE = 'ASSOCIATE_RESOURCE_TO_NODE'
const UNASSOCIATE_RESOURCE_FROM_NODE = 'UNASSOCIATE_RESOURCE_FROM_NODE'
const UPVOTE = 'UPVOTE'
const DOWNVOTE = 'DOWNVOTE'
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
const assocateToNode = () => ({
  type: ASSOCIATE_RESOURCE_TO_NODE
})
const unAssociateFromNode = () => ({
  type: UNASSOCIATE_RESOURCE_FROM_NODE
})

const upvoteResource = resource => ({
  type: UPVOTE,
  resource
})

const downvoteResource = resource => ({
  type: DOWNVOTE,
  resource
})
/**
 * THUNK CREATORS
 */

export const getResources = node => async dispatch => {
  try {
    const res = await axios.get(`/api/resources/${node.id}`)
    dispatch(fetchResources(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getResourcesByNode = node => async dispatch => {
  try {
    console.log(node)
    const res = await axios.put(`/api/resources/${node.id}`)
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

export const associateResourceToNode = resource => async dispatch => {
  try {
    await axios.post(`/api/resources/add`, resource)
    dispatch(assocateToNode())
  } catch (err) {
    console.error(err)
  }
}

export const unAssociateResourceFromNode = resource => async dispatch => {
  try {
    await axios.put('/api/resources/remove', resource)
    dispatch(unAssociateFromNode())
  } catch (err) {
    console.error(err)
  }
}

export const upvote = resource => async dispatch => {
  try {
    const res = await axios.put('/api/resources/upvote', resource)
    dispatch(upvoteResource(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const downvote = resource => async dispatch => {
  try {
    const res = await axios.put('/api/resources/downvote', resource)
    dispatch(downvoteResource(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delResource = resource => async dispatch => {
  try {
    const res = await axios.delete(`/api/resources/${resource.resource.id}`, {
      data: {resource: resource}
    })
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
    case ASSOCIATE_RESOURCE_TO_NODE:
      return state
    case UNASSOCIATE_RESOURCE_FROM_NODE:
      return state
    default:
      return state
  }
}
