import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_LINK = 'GET_LINK'
const CREATE_LINK = 'CREATE_LINK'

/**
 * INITIAL STATE
 */
const defaultLink = {}

/**
 * ACTION CREATORS
 */
const fetchLink = link => ({type: GET_LINK, link})

const createLink = link => ({type: CREATE_LINK, link})

/**
 * THUNK CREATORS
 */

export const getLink = resourceId => async dispatch => {
  try {
    const res = await axios.get(`/api/links/${resourceId}`)
    dispatch(fetchLink(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const postLink = link => async dispatch => {
  try {
    const res = await axios.post('/api/links', link)
    dispatch(createLink(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultLink, action) {
  switch (action.type) {
    case GET_LINK:
      return action.link
    case CREATE_LINK:
      return action.link
    default:
      return state
  }
}
