import axios from 'axios'

/**
 * ACTION TYPES
 */

const UPVOTE = 'UPVOTE'
const DOWNVOTE = 'DOWNVOTE'
const FETCH_VOTE = 'FETCH_VOTE'
/**
 * INITIAL STATE
 */
const defaultVote = {}

/**
 * ACTION CREATORS
 */
const upvoteResource = vote => ({
  type: UPVOTE,
  vote
})

const downvoteResource = vote => ({
  type: DOWNVOTE,
  vote
})

const fetchVote = vote => ({
  type: FETCH_VOTE,
  vote
})

/**
 * THUNK CREATORS
 */

export const upvote = resource => async dispatch => {
  try {
    const res = await axios.put('/api/votes/upvote', resource)
    dispatch(upvoteResource(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const downvote = resource => async dispatch => {
  try {
    const res = await axios.put('/api/votes/downvote', resource)
    dispatch(downvoteResource(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getVote = resource => async dispatch => {
  try {
    const res = await axios.get(`/api/votes/${resource.id}`)

    dispatch(fetchVote(res.data))
  } catch (err) {
    console.error(err)
  }
}
/**
 * REDUCER
 */

export default function(state = defaultVote, action) {
  switch (action.type) {
    case UPVOTE:
      return action.vote
    case DOWNVOTE:
      return action.vote
    case FETCH_VOTE:
      return action.vote
    default:
      return state
  }
}
