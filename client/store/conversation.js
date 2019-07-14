import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CONVERSATIONS = 'GET_CONVERSATIONS'
const GET_SELECTED_CONVERSATION = 'GET_SELECTED_CONVERSATION'
const REMOVE_CONVERSATION = 'REMOVE_CONVERSATION'
const CREATE_CONVERSATION = 'CREATE_CONVERSATION'
const TOGGLE_CONVERSATION_STATUS = 'TOGGLE_CONVERSATION_STATUS'
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

const fetchSelectedConversation = conversation => ({
  type: GET_SELECTED_CONVERSATION,
  conversation
})

const toggleConversationStatus = conversation => ({
  type: TOGGLE_CONVERSATION_STATUS,
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

export const getSelectedConversation = conversationId => async dispatch => {
  try {
    const res = await axios.get(`/api/conversations/${conversationId}`)
    return dispatch(fetchSelectedConversation(res.data))
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

export const putConversation = conversation => async dispatch => {
  try {
    const res = await axios.put('/api/conversations', conversation)
    dispatch(toggleConversationStatus(res.data))
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
      return action.conversation.sort(function(a, b) {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
    case REMOVE_CONVERSATION:
      return state.filter(
        conversation => conversation.id !== action.conversation
      )
    case GET_SELECTED_CONVERSATION:
      return action.conversation
    case CREATE_CONVERSATION:
      return [...state, action.conversation]
    case TOGGLE_CONVERSATION_STATUS:
      return [
        ...state.filter(
          conversation => conversation.id !== action.conversation.id
        ),
        action.conversation
      ]
    default:
      return state
  }
}
