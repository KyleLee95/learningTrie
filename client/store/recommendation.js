import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_RECOMMENDATIONS = 'GET_RECOMMENDATIONS'
const REMOVE_RECOMMENDATIONS = 'REMOVE_RECOMMENDATIONS'
const UPDATE_RECOMMENDATIONS = 'UPDATE_RECOMMENDATIONS'
const CREATE_RECOMMENDATIONS = 'CREATE_RECOMMENDATIONS'

/**
 * INITIAL STATE
 */
const defaultRecommendations = []

/**
 * ACTION CREATORS
 */
const fetchRecommendations = recommendation => ({
  type: GET_RECOMMENDATIONS,
  recommendation
})
const removeRecommendation = recommendation => ({
  type: REMOVE_RECOMMENDATIONS,
  recommendation
})
const createRecommendation = recommendation => ({
  type: CREATE_RECOMMENDATIONS,
  recommendation
})
const updateRecommendation = recommendation => ({
  type: UPDATE_RECOMMENDATIONS,
  recommendation
})
/**
 * THUNK CREATORS
 */

export const getRecommendations = () => async dispatch => {
  try {
    const res = await axios.get(`/api/recommendations/`)
    dispatch(fetchRecommendations(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getSingleRecommendation = recommendationId => async dispatch => {
  try {
    const res = await axios.get(`/api/recommendations/${recommendationId}`)
    dispatch(fetchRecommendations(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delRecommendation = recommendation => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/recommendations/${recommendation.recommendation.id}`,
      {
        data: {recommendation: recommendation}
      }
    )
    dispatch(removeRecommendation(recommendation))
  } catch (err) {
    console.error(err)
  }
}

export const postRecommendation = recommendation => async dispatch => {
  try {
    const res = await axios.post('/api/recommendations', recommendation)
    dispatch(createRecommendation(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putRecommendation = recommendation => async dispatch => {
  try {
    const res = await axios.put('/api/recommendations', recommendation)
    dispatch(updateRecommendation(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultRecommendations, action) {
  switch (action.type) {
    case GET_RECOMMENDATIONS:
      return action.recommendation
    case REMOVE_RECOMMENDATIONS:
      return []
    case UPDATE_RECOMMENDATIONS:
      return action.recommendation
    case CREATE_RECOMMENDATIONS:
      return [...state, action.recommendation]
    default:
      return state
  }
}
