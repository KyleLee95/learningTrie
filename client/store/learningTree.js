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
const ADD_FAV_TREE = 'ADD_FAV_TREE'
const REMOVE_FAV_TREE = 'REMOVE_FAV_TREE'
const SET_SHARED_TREES = 'SET_SHARED_TREES'
const SET_SELECTED_TREE = 'SET_SELECTED_TREE'
const CREATE_TREE = 'CREATE_TREE'
const UPDATE_TREE = 'UPDATE_TREE'
const DELETE_TREE = 'DELETE_TREE'
const ADD_USER_TO_TREE = 'ADD_USER_TO_TREE'
const REMOVE_USER_FROM_TREE = 'ADD_USER_TO_TREE'
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
const addUserToTree = tree => ({
  type: ADD_USER_TO_TREE,
  tree
})
const removeUserFromTree = tree => ({
  type: REMOVE_USER_FROM_TREE,
  tree
})

const addTreeToFav = tree => ({
  type: ADD_FAV_TREE,
  tree
})

const removeTreeFromFav = tree => ({
  type: REMOVE_FAV_TREE,
  tree
})
/**
 * THUNK CREATORS
 */
export const fetchTrees = () => async dispatch => {
  try {
    const res = await axios.get('/api/learningTrees/allTrees')
    return dispatch(getTrees(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const fetchSearchTrees = search => async dispatch => {
  try {
    const res = await axios.get(`/api/learningTrees/search?${search}`)
    dispatch(searchTrees(res.data))
    history.push(`/search?q=${search}`)
  } catch (err) {
    console.log(err)
  }
}

export const fetchMyTrees = userId => async dispatch => {
  try {
    const res = await axios.get('/api/learningTrees/myTrees')

    return dispatch(
      myTrees({
        trees: res.data,
        userId: userId
      })
    )
  } catch (err) {
    console.error(err)
  }
}

export const fetchSharedTrees = userId => async dispatch => {
  try {
    const res = await axios.get('/api/learningTrees/sharedWithMe')
    return dispatch(sharedTrees({tree: res.data, userId}))
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

export const fetchFavoriteTrees = () => async dispatch => {
  try {
    const res = await axios.get(`/api/learningTrees/favoriteTrees`)
    return dispatch(favTrees(res.data))
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

export const associateUserToTree = user => async dispatch => {
  try {
    const res = await axios.put('/api/learningTrees/addCollaborator', user)
    return dispatch(addUserToTree(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const unassociateUserFromTree = user => async dispatch => {
  try {
    const res = await axios.put('/api/learningTrees/removeCollaborator', user)
    return dispatch(removeUserFromTree(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const addTreeToFavorites = treeId => async dispatch => {
  try {
    const res = await axios.post('/api/learningTrees/addFavorite', treeId)
    return dispatch(addTreeToFav(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const removeTreeFromFavorites = treeId => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/learningTrees/removeFavorite/${treeId.learningTreeId}`
    )
    return dispatch(removeTreeFromFav(res.data))
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
    case SET_MY_TREES:
      return action.tree.trees.filter(tree => {
        return tree.ownerId === action.tree.userId
      })
    case SET_SHARED_TREES:
      return action.tree.tree.filter(tree => {
        return tree.ownerId !== action.tree.userId
      })
    case SET_FAV_TREES:
      return action.tree
    case ADD_FAV_TREE:
      return action.tree
    case REMOVE_FAV_TREE:
      return action.tree
    case ADD_USER_TO_TREE:
      return action.tree
    case REMOVE_USER_FROM_TREE:
      return action.tree
    case DELETE_TREE:
      return []
    default:
      return state
  }
}
