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
            {this.props.tag.learningTrees && this.props.tag.learningTrees.length
              ? this.props.tag.learningTrees.map(tree => {
                  return (
                    <React.Fragment key={tree.id}>
                      <Card>
                        <Card.Body>
                          <Card.Title>
                            <Row>
                              <Col>
                                <React.Fragment>
                                  <Link
                                    to={`/learningTree/${tree.id}`}
                                    style={{color: 'black'}}
                                  >
                                    {tree.title} | Score:{' '}
                                    {tree.reviews !== undefined
                                      ? tree.reviews.reduce(
                                          (accumulator, review) => {
                                            return (
                                              accumulator +
                                              review.rating /
                                                tree.reviews.length
                                            )
                                          },
                                          0
                                        )
                                      : 0}
                                    / 5 |
                                  </Link>{' '}
                                  created by:{' '}
                                  <Link
                                    to={`/user/${tree.ownerId}`}
                                    style={{color: 'black'}}
                                  >
                                    {tree.users.filter(user => {
                                      return user.id === tree.ownerId
                                    })[0] !== undefined
                                      ? tree.users.filter(user => {
                                          return user.id === tree.ownerId
                                        })[0].username
                                      : null}
                                  </Link>
                                </React.Fragment>
                              </Col>
                            </Row>
                          </Card.Title>
                          <Card.Subtitle className="text-muted">
                            {tree.description}
                          </Card.Subtitle>
                          <hr />
                          <Row>
                            <Col>
                              Tags:
                              {tree && tree.tags && tree.tags.length > 0
                                ? tree.tags.map(tag => {
                                    return (
                                      <Link to={`/tag/${tag.id}`} key={tag.id}>
                                        <Button size="sm" variant="light">
                                          {tag.title}{' '}
                                        </Button>
                                      </Link>
                                    )
                                  })
                                : null}
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                      <br />
                    </React.Fragment>
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
    user: state.currUser,
    tag: state.tag
  }
}

export const ConnectedTag = connect(mapState, mapDispatch)(Tag)
