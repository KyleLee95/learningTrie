import React, {Component} from 'react'
import {ConnectedNewTree} from '.'
import {connect} from 'react-redux'
import {Row, Col, Button, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {fetchTrees, fetchMyTrees} from '../store/learningTree'

/**
 * COMPONENT
 */
class UserHome extends Component {
  componentDidMount() {
    // this.props.fetchTrees()
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={2}>
            <React.Fragment>
              <Card>
                <Button variant="submit">All Trees</Button>
              </Card>
              <Card>
                <Button
                  onClick={() => this.props.fetchMyTrees(this.props.user.id)}
                  variant="submit"
                >
                  My Trees
                </Button>
              </Card>
              <Card>
                <Button variant="submit">Favorite Trees</Button>
              </Card>
              <Card>
                <Button variant="submit">Trees Shared With Me</Button>
              </Card>

              <ConnectedNewTree />
            </React.Fragment>
          </Col>
          <Col xs={9}>
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
            {this.props.user.learningTrees &&
            this.props.user.learningTrees.length
              ? this.props.user.learningTrees.map(tree => {
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
                                {tree.reviews.reduce((accumulator, review) => {
                                  return (
                                    accumulator +
                                    review.rating / tree.reviews.length
                                  )
                                }, 0)}{' '}
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
                              })}{' '}
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
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}
const mapDispatch = dispatch => {
  return {
    fetchTrees: () => dispatch(fetchTrees()),
    fetchMyTrees: userId => dispatch(fetchMyTrees(userId))
  }
}

export default connect(mapState, mapDispatch)(UserHome)
