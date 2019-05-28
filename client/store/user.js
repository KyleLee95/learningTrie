import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USERS = 'GET_USERS'
const REMOVE_USER = 'REMOVE_USER'
const SET_USER_AS_FOLLOWER = 'SET_USER_AS_FOLLOWER'
// const ADD_USER_TO_TREE = 'ADD_USER_TO_TREE'

/**
 * INITIAL STATE
 */
const defaultUsers = []

/**
 * ACTION CREATORS
 */
const getSingleUser = users => ({type: GET_USERS, users})
const associateUserToUser = users => ({type: SET_USER_AS_FOLLOWER, users})
const removeUser = () => ({type: REMOVE_USER})
// const addUserToTree = () => ({type: ADD_USER_TO_TREE})

/**
 * THUNK CREATORS
 */
export const fetchSingleUser = userId => async dispatch => {
  try {
    const res = await axios.get(`/api//users/${userId}`)
    return dispatch(getSingleUser(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const addFollower = userId => async dispatch => {
  try {
    const res = await axios.put(`/api/users/follow/${userId}`)
    return dispatch(associateUserToUser(res.data))
  } catch (err) {
    console.error(err)
  }
}

// export const associateUserToTree = data => async dispatch => {
//   try {
//     await axios.put('/api/users/isOwner', data)
//     return dispatch(addUserToTree())
//   } catch (err) {
//     console.error(err)
//   }
// }

/**
 * REDUCER
 */
export default function(state = defaultUsers, action) {
  switch (action.type) {
    case GET_USERS:
      return action.users
    case REMOVE_USER:
      return defaultUsers
    case SET_USER_AS_FOLLOWER:
      return action.users
    // case ADD_USER_TO_TREE:
    // return state
    default:
      return state
  }
}
