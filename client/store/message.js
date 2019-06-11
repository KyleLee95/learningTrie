import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_MESSAGES = 'GET_MESSAGES'
const CREATE_MESSAGE = 'CREATE_MESSAGE'

/**
 * INITIAL STATE
 */
const defaultMessages = []

/**
 * ACTION CREATORS
 */
const fetchMessages = message => ({
  type: GET_MESSAGES,
  message
})

const createMessage = message => ({
  type: CREATE_MESSAGE,
  message
})

/**
 * THUNK CREATORS
 */

export const getMessages = conversationId => async dispatch => {
  try {
    const res = await axios.get(`/api/messages/${conversationId}`)
    dispatch(fetchMessages(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const postMessage = message => async dispatch => {
  try {
    const res = await axios.post('/api/messages', message)
    dispatch(createMessage(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultMessages, action) {
  switch (action.type) {
    case GET_MESSAGES:
      return action.message.sort(function(a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt)
      })
    case CREATE_MESSAGE:
      return action.message.sort(function(a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt)
      })
    default:
      return state
  }
}
