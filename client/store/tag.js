import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_TAGS = 'GET_TAGS'
const REMOVE_TAG = 'REMOVE_TAG'
const UPDATE_TAG = 'UPDATE_TAG'
const CREATE_TAG = 'CREATE_TAG'

/**
 * INITIAL STATE
 */
const defaultReviews = []

/**
 * ACTION CREATORS
 */
const fetchTags = tag => ({type: GET_TAGS, tag})
const removeTag = tag => ({type: REMOVE_TAG, tag})
const createTag = tag => ({type: CREATE_TAG, tag})
const updateTag = tag => ({type: UPDATE_TAG, tag})
/**
 * THUNK CREATORS
 */

export const getTags = () => async dispatch => {
  try {
    const res = await axios.get(`/api/tags/`)
    dispatch(fetchTags(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getSingleTag = tagId => async dispatch => {
  try {
    const res = await axios.get(`/api/tags/${tagId}`)
    dispatch(fetchTags(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delTag = tag => async dispatch => {
  try {
    const res = await axios.delete(`/api/tags/${tag.tag.id}`, {
      data: {tag: tag}
    })
    dispatch(removeTag(tag))
  } catch (err) {
    console.error(err)
  }
}

export const postTag = tag => async dispatch => {
  try {
    const res = await axios.post('/api/tags', tag)
    dispatch(createTag(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putTag = tag => async dispatch => {
  try {
    const res = await axios.put('/api/tags', tag)
    dispatch(updateTag(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultReviews, action) {
  switch (action.type) {
    case GET_TAGS:
      return action.tag
    case REMOVE_TAG:
      return []
    case UPDATE_TAG:
      return action.tag
    case CREATE_TAG:
      return [...state, action.tag]
    default:
      return state
  }
}
