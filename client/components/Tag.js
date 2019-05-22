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
    await this.props.getSingleTag(Number(this.props.match.params.id))
  }

  async componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      await this.props.getSingleTag(Number(this.props.match.params.id))
    }
  }

  render() {
    return (
      //Proably wrong and I hate this but it works
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <h3>
              Trees also tagged with:
              {this.props.tag && this.props.tag.title !== undefined
                ? this.props.tag.title
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
                            {tree.ownerId === this.props.user.id ? (
                              <Link
                                style={{
                                  textDecoration: 'none',
                                  color: '#000000'
                                }}
                                to={`/learningTree/${tree.id}`}
                              >
                                {' '}
                                <Card.Title>me</Card.Title>
                              </Link>
                            ) : (
                              <Link
                                style={{
                                  textDecoration: 'none',
                                  color: '#000000'
                                }}
                                to={`/learningTree/${tree.id}`}
                              >
                                {' '}
                                <Card.Title>
                                  {
                                    tree.users.filter(user => {
                                      return user.id === tree.ownerId
                                    })[0].firstName
                                  }{' '}
                                  {
                                    tree.users.filter(user => {
                                      return user.id === tree.ownerId
                                    })[0].lastName
                                  }{' '}
                                </Card.Title>
                              </Link>
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
                                {tree.reviews.length > 0
                                  ? tree.reviews.reduce((acc, review) => {
                                      return review.rating + acc
                                    }, 0) / tree.reviews.length
                                  : 0}{' '}
                                / 5
                              </Card.Title>
                            </Link>
                          </Col>
                          <Col xs={3}>
                            <Card.Title>
                              {tree.tags.map(tag => {
                                return (
                                  <Link to={`/tag/${tag.id}`} key={tag.id}>
                                    <Button size="sm" variant="light">
                                      {tag.title}
                                    </Button>
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
    getSingleTag: tagId => dispatch(getSingleTag(tagId))
  }
}

const mapState = state => {
  return {
    user: state.user,
    tag: state.tag
  }
}

export const ConnectedTag = connect(mapState, mapDispatch)(Tag)
