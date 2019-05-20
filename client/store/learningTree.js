/*eslint-disable complexity */
import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TREE = 'GET_TREE'
const SEARCH_TREE = 'SEARCH_TREE'
const SET_MY_TREES = 'SET_MY_TREES'
const SET_FAV_TREES = 'SET_FAV_TREES'
const SET_SHARED_TREES = 'SET_SHARED_TREES'
const SET_SELECTED_TREE = 'SET_SELECTED_TREE'
const CREATE_TREE = 'CREATE_TREE'
const UPDATE_TREE = 'UPDATE_TREE'
const DELETE_TREE = 'DELETE_TREE'
/**
 * INITIAL STATE
 */
const defaultTree = []

/**
 * ACTION CREATORS
 */
const getTrees = tree => ({
  type: GET_TREE,
  tree
})

const searchTrees = tree => ({
  type: SEARCH_TREE,
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

const myTrees = tree => ({
  type: SET_MY_TREES,
  tree
})

const favTrees = tree => ({
  type: SET_FAV_TREES,
  tree
})

const sharedTrees = tree => ({
  type: SET_SHARED_TREES,
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

export const fetchSearchTrees = search => async dispatch => {
  try {
    const res = await axios.get(`/api/learningTrees/search?${search}`)
    history.push('/search')
    return dispatch(searchTrees(res.data))
  } catch (err) {
    console.log(err)
  }
}

export const fetchMyTrees = userId => async dispatch => {
  try {
    const res = await axios.get('/api/learningTrees')

    return dispatch(
      myTrees({
        data: res.data,
        userId: userId
      })
    )
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
    const res = await axios.delete(`/api/learningTrees/${treeId}`)
    history.push('/home')
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
    case SEARCH_TREE:
      return action.tree
    case CREATE_TREE:
      return action.tree
    case UPDATE_TREE:
      return action.tree
    case SET_SELECTED_TREE:
      return action.tree
    case DELETE_TREE:
      return {}
    default:
      return state
  }
}
