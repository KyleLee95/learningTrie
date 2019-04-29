import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TREE = 'GET_TREE'
const SET_SELECTED_TREE = 'SET_SELECTED_TREE'
const CREATE_TREE = 'CREATE_TREE'
const UPDATE_TREE = 'UPDATE_TREE'
const DELETE_TREE = 'DELETE_TREE'
/**
 * INITIAL STATE
 */
const defaultTree = {}

/**
 * ACTION CREATORS
 */
const getTrees = tree => ({
  type: GET_TREE,
  tree
})

const setSelectedTree = tree => ({
  type: SET_SELECTED_TREE,
  tree
})

const createTree = tree => ({
  type: CREATE_TREE,
  tree
})

const updateTree = tree => ({
  type: UPDATE_TREE,
  tree
})

const deleteTree = tree => ({
  type: DELETE_TREE,
  tree
})
/**
 * THUNK CREATORS
 */
export const fetchTrees = () => async dispatch => {
  try {
    const res = await axios.get('/api/learningTrees')
    return dispatch(getTrees(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const fetchSelectedTree = treeId => async dispatch => {
  try {
    const res = await axios.get(`/api/learningTrees/${treeId}`)
    return dispatch(setSelectedTree(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const postTree = data => async dispatch => {
  try {
    const res = await axios.post('/api/learningTrees/', data)
    history.push(`/learningTree/${res.data.id}`)
    return dispatch(createTree(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putTree = data => async dispatch => {
  try {
    const res = await axios.put(`/api/learningTrees/${data.id}`, data)
    return dispatch(updateTree(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delTree = treeId => async dispatch => {
  try {
    history.push('/home')
    const res = await axios.delete(`/api/learningTrees/${treeId}`)
    return dispatch(deleteTree(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultTree, action) {
  switch (action.type) {
    case GET_TREE:
      return action.tree
    case SET_SELECTED_TREE:
      return action.tree
    case CREATE_TREE:
      return action.tree
    case UPDATE_TREE:
      return action.tree
    case DELETE_TREE:
      return state
    default:
      return state
  }
}
