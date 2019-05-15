import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_REVIEWS = 'GET_REVIEWS'
const REMOVE_REVIEW = 'REMOVE_REVIEW'
const UPDATE_REVIEW = 'UPDATE_REVIEW'
const CREATE_REVIEW = 'CREATE_REVIEW'

/**
 * INITIAL STATE
 */
const defaultReviews = []

/**
 * ACTION CREATORS
 */
const fetchReview = review => ({type: GET_REVIEWS, review})
const removeReview = review => ({type: REMOVE_REVIEW, review})
const createReview = review => ({type: CREATE_REVIEW, review})
const updateReview = review => ({type: UPDATE_REVIEW, review})
/**
 * THUNK CREATORS
 */

export const getReviews = () => async dispatch => {
  try {
    const res = await axios.get(`/api/reviews/`)
    dispatch(fetchReview(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getSingleReview = reviewId => async dispatch => {
  try {
    const res = await axios.get(`/api/reviews/${reviewId}`)
    dispatch(fetchReview(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const delReview = review => async dispatch => {
  try {
    const res = await axios.delete(`/api/reviews/${review.review.id}`, {
      data: {review: review}
    })
    dispatch(removeReview(review))
    history.push(`/learningTree/${res.data.learningTreeId}`)
  } catch (err) {
    console.error(err)
  }
}

export const postReview = review => async dispatch => {
  try {
    const res = await axios.post('/api/reviews', review)
    dispatch(createReview(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const putReview = review => async dispatch => {
  try {
    const res = await axios.put('/api/reviews', review)
    dispatch(updateReview(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultReviews, action) {
  switch (action.type) {
    case GET_REVIEWS:
      return action.review
    case REMOVE_REVIEW:
      return []
    case UPDATE_REVIEW:
      return action.review
    case CREATE_REVIEW:
      return [...state, action.review]
    default:
      return state
  }
}
