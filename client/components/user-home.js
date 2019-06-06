import React, {Component} from 'react'
import {ConnectedNewTree} from '.'
import {connect} from 'react-redux'
import {Row, Col, Button, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {fetchTrees, fetchMyTrees} from '../store/learningTree'
import {me} from '../store/currentUser'
/**
 * COMPONENT
 */
class UserHome extends Component {
  async componentDidMount() {
    await this.props.fetchTrees()
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={2}>
            <React.Fragment>
              <Card>
                <Button variant="submit" onClick={this.props.fetchTrees}>
                  News Feed
                </Button>
              </Card>
              <Card>
                <Button variant="submit" onClick={this.props.fetchTrees}>
                  All Trees
                </Button>
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
          <Col lg={9}>
            <Card>
              <Card.Body>
                <Row>
                  <Col lg={4}>
                    <Card.Title>title </Card.Title>
                  </Col>
                  <Col lg={1}>
                    <Card.Title>owner</Card.Title>
                  </Col>
                  <Col lg={3}>
                    <Card.Title>description</Card.Title>
                  </Col>
                  <Col lg={1}>
                    <Card.Title>rating</Card.Title>
                  </Col>
                  <Col lg={3}>
                    <Card.Title>tags</Card.Title>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {this.props.trees && this.props.trees[0] !== undefined
              ? this.props.trees.map(tree => {
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
                              `${
                                tree.users.filter(user => {
                                  return tree.ownerId === user.id
                                })[0].firstName
                              }
                            ${
                              tree.users.filter(user => {
                                return tree.ownerId === user.id
                              })[0].lastName
                            }`
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
                                {tree.reviews !== undefined
                                  ? tree.reviews.reduce(
                                      (accumulator, review) => {
                                        return (
                                          accumulator +
                                          review.rating / tree.reviews.length
                                        )
                                      },
                                      0
                                    )
                                  : 0}{' '}
                                / 5
                              </Card.Title>
                            </Link>
                          </Col>
                          <Col xs={3}>
                            <Card.Title>
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
                                : ''}{' '}
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
    user: state.currUser,
    trees: state.tree
  }
}
const mapDispatch = dispatch => {
  return {
    fetchTrees: () => dispatch(fetchTrees()),
    fetchMyTrees: userId => dispatch(fetchMyTrees(userId)),
    me: () => dispatch(me())
  }
}

export default connect(mapState, mapDispatch)(UserHome)
