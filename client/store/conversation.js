import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CONVERSATIONS = 'GET_CONVERSATIONS'
const REMOVE_CONVERSATION = 'REMOVE_CONVERSATION'
const CREATE_CONVERSATION = 'CREATE_CONVERSATION'

/**
 * INITIAL STATE
 */
const defaultConversations = []

/**
 * ACTION CREATORS
 */
const fetchConversations = conversation => ({
  type: GET_CONVERSATIONS,
  conversation
})
const removeConversation = conversation => ({
  type: REMOVE_CONVERSATION,
  conversation
})
const createConversation = conversation => ({
  type: CREATE_CONVERSATION,
  conversation
})

/**
 * THUNK CREATORS
 */

export const getConversations = () => async dispatch => {
  try {
    const res = await axios.get(`/api/conversations/`)
    dispatch(fetchConversations(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delConversation = conversationId => async dispatch => {
  try {
    await axios.delete(`/api/conversations/${conversationId}`)
    dispatch(removeConversation(conversationId))
  } catch (err) {
    console.error(err)
  }
}

export const postConversation = conversation => async dispatch => {
  try {
    const res = await axios.post('/api/conversations', conversation)
    dispatch(createConversation(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultConversations, action) {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return action.conversation
    case REMOVE_CONVERSATION:
      return state.filter(
        conversation => conversation.id !== action.conversation
      )
    case CREATE_CONVERSATION:
      return [action.conversation]
    default:
      return state
  }
}
