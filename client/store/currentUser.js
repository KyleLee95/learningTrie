import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_CURRENT_USER = 'GET_CURRENT_USER'
const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER'

const READ_MAIL = 'READ_MAIL'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = currUser => ({type: GET_CURRENT_USER, currUser})
const removeUser = () => ({type: REMOVE_CURRENT_USER})
const toggleMail = currUser => ({type: READ_MAIL, currUser})

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

export const auth = (
  email,
  password,
  firstName,
  lastName,
  username,
  dbUsername,
  method
) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {
      email,
      password,
      firstName,
      lastName,
      dbUsername,
      username
    })
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

export const readMail = () => async dispatch => {
  try {
    const res = await axios.put('/auth/checkMail')
    return dispatch(toggleMail(res.data))
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
      return action.currUser
    case REMOVE_CURRENT_USER:
      return defaultUser
    case READ_MAIL:
      return action.currUser
    default:
      return state
  }
}
