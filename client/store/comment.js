import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_COMMENTS = 'GET_COMMENTS'
const REMOVE_COMMENT = 'REMOVE_COMMENT'
const UPDATE_COMMENT = 'UPDATE_COMMENT'
const CREATE_COMMENT = 'CREATE_COMMENT'
const CREATE_REPLY_COMMENT = 'CREATE_REPLY_COMMENT'

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
const createReply = comment => ({type: CREATE_REPLY_COMMENT, comment})
/**
 * THUNK CREATORS
 */

export const getComments = linkId => async dispatch => {
  try {
    const res = await axios.get(`/api/comments/${linkId}`)
    dispatch(fetchComments(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delComment = commentId => async dispatch => {
  try {
    await axios.delete(`/api/comments/${commentId}`)
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
    const res = await axios.put(`/api/comments/${comment.commentId}`, comment)
    dispatch(updateComment(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const postReply = comment => async dispatch => {
  try {
    const res = await axios.post(`/api/comments/reply`, comment)
    dispatch(createReply(res.data))
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
      return state.filter(comment => comment.id !== action.comment)
    case UPDATE_COMMENT:
      return [
        ...state.filter(comment => {
          return comment.id !== action.comment.id
        }),
        action.comment
      ]
    case CREATE_COMMENT:
      return [...state, action.comment]
    case CREATE_REPLY_COMMENT:
      return [...state, action.comment]
    default:
      return state
  }
}
