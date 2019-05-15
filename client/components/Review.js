import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {getReviews} from '../store/review'

class Review extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false
    }
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  async componentDidMount() {
    await this.props.getReviews(Number(this.props.match.params.id))
  }

  handleShow() {
    this.setState({
      show: true
    })
  }

  handleClose() {
    this.setState({
      show: false
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit() {
    this.props.putResource({
      id: Number(this.props.match.params.id),
      title: this.state.title,
      description: this.state.description,
      link: this.state.link,
      type: this.state.type
    })
    this.handleClose()
  }

  render() {
    return (
      <div>
        {this.props.reviews[0] && this.props.reviews[0].learningTree ? (
          <Row>
            {' '}
            <h1>Reviews For: {this.props.reviews[0].learningTree.title}</h1>
          </Row>
        ) : (
          ''
        )}
        <Row>
          <Col xs={{span: 8, offset: 2}}>
            {this.props.reviews.map(review => {
              return (
                <Card key={review.id}>
                  <Card.Title>
                    Title: {review.title} | Rating: {review.rating}
                  </Card.Title>

                  <Card.Title>
                    {review.user.firstName} {review.user.lastName} says:{' '}
                  </Card.Title>
                  <Card.Body>{review.content}</Card.Body>
                </Card>
              )
            })}
          </Col>
        </Row>
      </div>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    getReviews: learningTreeId => dispatch(getReviews(learningTreeId))
    // getSingleReview,
    // delReview,
    // postReview: review => dispatch(postReview(review)),
    // putReview
  }
}

const mapState = state => {
  return {
    reviews: state.review,
    tree: state.tree
  }
}

export const ConnectedReview = connect(mapState, mapDispatch)(Review)
