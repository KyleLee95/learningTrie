import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {fetchSelectedTree} from '../store/LearningTree'

class Tag extends Component {
  constructor(props, context) {
    super(props, context)
    // this.state = {
    //   show: false
    // }
    // this.handleShow = this.handleShow.bind(this)
    // this.handleClose = this.handleClose.bind(this)
    // this.handleChange = this.handleChange.bind(this)
    // this.handleSubmit = this.handleSubmit.bind(this)
  }
  async componentDidMount() {}

  render() {
    return <div>HELLO WORLD. TAGS</div>
  }
}

const mapDispatch = dispatch => {
  return {
    getReviews: learningTreeId => dispatch(getReviews(learningTreeId)),
    fetchSelectedTree: learningTreeId =>
      dispatch(fetchSelectedTree(learningTreeId))
    // getSingleReview,
    // delReview,
    // postReview: review => dispatch(postReview(review)),
    // putReview
  }
}

const mapState = state => {
  return {
    user: state.user,
    reviews: state.review,
    tree: state.tree,
    tag: state.tag
  }
}

export const ConnectedTag = connect(mapState, mapDispatch)(Tag)
