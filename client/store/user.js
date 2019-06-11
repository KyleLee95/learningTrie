import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USERS = 'GET_USERS'
const REMOVE_USER = 'REMOVE_USER'
const FOLLOW_USER = 'FOLLOW_USER'
const UNFOLLOW_USER = 'UNFOLLOW_USER'

// const ADD_USER_TO_TREE = 'ADD_USER_TO_TREE'

/**
 * INITIAL STATE
 */
const defaultUsers = []

/**
 * ACTION CREATORS
 */
const getSingleUser = users => ({type: GET_USERS, users})
const followUser = users => ({type: FOLLOW_USER, users})
const unfollowUser = users => ({type: UNFOLLOW_USER, users})

// const removeUser = () => ({type: REMOVE_USER})
// const addUserToTree = () => ({type: ADD_USER_TO_TREE})

/**
 * THUNK CREATORS
 */
export const fetchSingleUser = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/users/${userId}`)
    return dispatch(getSingleUser(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const addFollower = userId => async dispatch => {
  try {
    const res = await axios.put(`/api/users/follow/${userId}`)
    return dispatch(followUser(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const removeFollower = userId => async dispatch => {
  try {
    const res = await axios.put(`/api/users/unfollow/${userId}`)
    return dispatch(unfollowUser(res.data))
  } catch (err) {
    console.error(err)
  }
}

/* REDUCER
 */
export default function(state = defaultUsers, action) {
  switch (action.type) {
    case GET_USERS:
      return action.users
    case REMOVE_USER:
      return defaultUsers
    case FOLLOW_USER:
      return action.users
    case UNFOLLOW_USER:
      return action.users
    default:
      return state
  }
}
