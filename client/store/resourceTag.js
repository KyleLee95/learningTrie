import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_RESOURCE_TAGS = 'GET_RESOURCE_TAGS'
const REMOVE_RESOURCE_TAG = 'REMOVE_RESOURCE_TAG'
const UPDATE_RESOURCE_TAG = 'UPDATE_RESOURCE_TAG'
const CREATE_RESOURCE_TAG = 'CREATE_RESOURCE_TAG'

/**
 * INITIAL STATE
 */
const defaultTags = []

/**
 * ACTION CREATORS
 */
const fetchResourceTags = tag => ({type: GET_RESOURCE_TAGS, tag})
const removeResourceTag = tag => ({type: REMOVE_RESOURCE_TAG, tag})
const createResourceTag = tag => ({type: UPDATE_RESOURCE_TAG, tag})
const updateResourceTag = tag => ({type: CREATE_RESOURCE_TAG, tag})
/**
 * THUNK CREATORS
 */

export const getResourceTags = () => async dispatch => {
  try {
    const res = await axios.get(`/api/resourceTags/`)
    dispatch(fetchResourceTags(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getSingleResourceTag = tagId => async dispatch => {
  try {
    const res = await axios.get(`/api/resourceTags/${tagId}`)
    dispatch(fetchResourceTags(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delResourceTag = tag => async dispatch => {
  try {
    const res = await axios.delete(`/api/resourceTags/${tag.tag.id}`, {
      data: {tag: tag}
    })
    dispatch(removeResourceTag(tag))
  } catch (err) {
    console.error(err)
  }
}

export const postResourceTag = tag => async dispatch => {
  try {
    const res = await axios.post('/api/resourceTags', tag)
    dispatch(createResourceTag(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putTag = tag => async dispatch => {
  try {
    const res = await axios.put('/api/resourceTags', tag)
    dispatch(updateResourceTag(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultTags, action) {
  switch (action.type) {
    case GET_RESOURCE_TAGS:
      return action.tag
    case REMOVE_RESOURCE_TAG:
      return []
    case UPDATE_RESOURCE_TAG:
      return action.tag
    case CREATE_RESOURCE_TAG:
      return [...state, action.tag]
    default:
      return state
  }
}
