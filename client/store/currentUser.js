import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_CURRENT_USER = 'GET_CURRENT_USER'
const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER'
const ADD_USER_TO_TREE = 'ADD_USER_TO_TREE'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_CURRENT_USER, user})
const removeUser = () => ({type: REMOVE_CURRENT_USER})
const addUserToTree = () => ({type: ADD_USER_TO_TREE})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }
  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

export const associateUserToTree = data => async dispatch => {
  try {
    await axios.put('/api/users/isOwner', data)
    return dispatch(addUserToTree())
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_CURRENT_USER:
      return action.user
    case REMOVE_CURRENT_USER:
      return defaultUser
    case ADD_USER_TO_TREE:
      return state
    default:
      return state
  }
}
