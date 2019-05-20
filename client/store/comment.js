import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_COMMENTS = 'GET_COMMENTS'
const REMOVE_COMMENT = 'REMOVE_COMMENT'
const UPDATE_COMMENT = 'UPDATE_COMMENT'
const CREATE_COMMENT = 'CREATE_COMMENT'

/**
 * INITIAL STATE
 */
const defaultEdges = []

/**
 * ACTION CREATORS
 */
const fetchComments = comment => ({type: GET_COMMENTS, comment})
const removeComment = comment => ({type: REMOVE_COMMENT, comment})
const createComment = comment => ({type: CREATE_COMMENT, comment})
const updateComment = comment => ({type: UPDATE_COMMENT, comment})
/**
 * THUNK CREATORS
 */

export const getComments = resourceId => async dispatch => {
  try {
    const res = await axios.get(`/api/comments/${resourceId}`)
    dispatch(fetchComments(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delComment = commentId => async dispatch => {
  try {
    await axios.delete(`/api/edges/${commentId}`)
    dispatch(removeComment(commentId))
  } catch (err) {
    console.error(err)
  }
}

export const postComment = comment => async dispatch => {
  try {
    const res = await axios.post('/api/comments', comment)
    dispatch(createComment(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putComment = comment => async dispatch => {
  try {
    const res = await axios.put('/api/edges', comment)
    dispatch(updateComment(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultEdges, action) {
  switch (action.type) {
    case GET_COMMENTS:
      return action.comment
    case REMOVE_COMMENT:
      return state.filter(edge => edge.id !== action.edge.id)
    case UPDATE_COMMENT:
      return [
        ...state.filter(edge => {
          return edge.id !== action.edge.id
        }),
        action.edge
      ]
    case CREATE_COMMENT:
      return [...state, action.comment]
    default:
      return state
  }
}
