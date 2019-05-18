import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {connect} from 'react-redux'
import {getReviews} from '../store/review'
import {fetchSelectedTree} from '../store/LearningTree'
import {ConnectedNewReview} from './NewReview'

class Review extends Component {
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
  async componentDidMount() {
    await this.props.getReviews(Number(this.props.match.params.id))
    await this.props.fetchSelectedTree(Number(this.props.match.params.id))
  }

  render() {
    return (
      <div>
        {this.props.tree && this.props.tree.title ? (
          <Row>
            <Row>
              <h1>Reviews For: {this.props.tree.title}</h1>
              {this.props.user.id !== this.props.tree.userId ? (
                <ConnectedNewReview />
              ) : (
                ''
              )}
            </Row>
          </Row>
        ) : (
          ''
        )}
        <Row>
          <Col xs={{span: 8, offset: 2}}>
            <ConnectedNewReview />
            {this.props.reviews.length > 0 &&
            this.props.reviews.filter(review => {
              return (
                review.learningTreeId === Number(this.props.match.params.id)
              )
            }).length > 0 ? (
              this.props.reviews
                .filter(review => {
                  return (
                    review.learningTreeId === Number(this.props.match.params.id)
                  )
                })
                .map(review => {
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
                })
            ) : (
              <React.Fragment>
                No Reviews Yet. Would you like to add one?
                <ConnectedNewReview />
              </React.Fragment>
            )}
            <ConnectedNewReview />
          </Col>
        </Row>
      </div>
    )
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
    tree: state.tree
  }
}

export const ConnectedReview = connect(mapState, mapDispatch)(Review)
