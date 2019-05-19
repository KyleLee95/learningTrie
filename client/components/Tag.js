/*eslint-disable complexity */
import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchTrees} from '../store/learningTree'
import {getSingleTag} from '../store/tag'
import {getReviews} from '../store/review'
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
  async componentDidMount() {
    await this.props.fetchTrees()
    await this.props.getSingleTag(Number(this.props.match.params.id))
    await this.props.getReviews()
  }

  render() {
    const filteredReviews = this.props.reviews.filter(review => {
      return review.learningTreeId === Number(this.props.match.params.id)
    })
    const checkRating =
      filteredReviews.reduce((acc, review) => {
        return acc + review.rating
      }, 0) / filteredReviews.length
    let rating = 0
    if (isNaN(checkRating) === true) {
      rating = 0
    } else {
      rating = checkRating.toString().slice(0, 4)
    }

    return (
      //Proably wrong and I hate this but it works
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <h3>
              Trees also tagged with:
              {this.props.tag &&
              this.props.tag.tag &&
              this.props.tag.tag.title !== undefined
                ? this.props.tag.tag.title
                : ''}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={4}>
                    <Card.Title>Title </Card.Title>
                  </Col>
                  <Col xs={1}>
                    <Card.Title>Owner</Card.Title>
                  </Col>
                  <Col xs={3}>
                    {' '}
                    <Card.Title>Description</Card.Title>
                  </Col>
                  <Col xs={1}>
                    <Card.Title>Rating</Card.Title>
                  </Col>
                  <Col xs={3}>
                    <Card.Title>Tags</Card.Title>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {this.props.tag.learningTrees && this.props.tag.learningTrees.length
              ? this.props.tag.learningTrees.map(tree => {
                  return (
                    <Card key={tree.id}>
                      <Card.Body>
                        <Row>
                          <Col xs={4}>
                            <Link
                              style={{
                                textDecoration: 'none',
                                color: '#000000'
                              }}
                              to={`/learningTree/${tree.id}`}
                            >
                              <Card.Title>{tree.title} </Card.Title>
                            </Link>
                          </Col>
                          <Col xs={1}>
                            {tree.userId === this.props.user.id ? (
                              <Link
                                style={{
                                  textDecoration: 'none',
                                  color: '#000000'
                                }}
                                to={`/learningTree/${tree.id}`}
                              >
                                {' '}
                                <Card.Title>Me</Card.Title>
                              </Link>
                            ) : (
                              ''
                            )}
                          </Col>
                          <Col xs={3}>
                            <Link
                              style={{
                                textDecoration: 'none',
                                color: '#000000'
                              }}
                              to={`/learningTree/${tree.id}`}
                            >
                              <Card.Title>{tree.description} </Card.Title>
                            </Link>
                          </Col>
                          <Col xs={1}>
                            <Link
                              style={{
                                textDecoration: 'none',
                                color: '#000000'
                              }}
                              to={`/learningTree/${tree.id}`}
                            >
                              <Card.Title>
                                {rating}
                                / 5
                              </Card.Title>
                            </Link>
                          </Col>
                          <Col xs={3}>
                            <Card.Title>
                              {tree.tags.map(tag => {
                                return (
                                  <Link to={`/tag/${tag.id}`} key={tag.id}>
                                    {tag.title}{' '}
                                  </Link>
                                )
                              })}
                            </Card.Title>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  )
                })
              : ''}
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    fetchTrees: () => dispatch(fetchTrees()),
    getSingleTag: tagId => dispatch(getSingleTag(tagId)),
    getReviews: () => dispatch(getReviews())
  }
}

const mapState = state => {
  return {
    user: state.user,
    reviews: state.review,
    trees: state.tree,
    tag: state.tag
  }
}

export const ConnectedTag = connect(mapState, mapDispatch)(Tag)
