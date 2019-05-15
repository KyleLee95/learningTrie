import React, {Component} from 'react'
import {ConnectedUserHomeTab, ConnectedSidebar, ConnectedNewTree} from '.'
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
          <Col xs={7}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={4}>
                    <Card.Title>Title </Card.Title>
                  </Col>
                  <Col xs={2}>
                    <Card.Title>Owner</Card.Title>
                  </Col>
                  <Col xs={6}>
                    <Card.Title>Description</Card.Title>
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
                        <Link to={`/learningTree/${tree.id}`}>
                          <Row>
                            <Col xs={4}>
                              <Card.Title>{tree.title} </Card.Title>
                            </Col>
                            <Col xs={2}>
                              {tree.userId === this.props.user.id ? (
                                <Card.Title>Me</Card.Title>
                              ) : (
                                ''
                              )}
                            </Col>
                            <Col xs={6}>
                              <Card.Title>{tree.description} </Card.Title>
                            </Col>
                          </Row>
                        </Link>
                      </Card.Body>
                    </Card>
                  )
                })
              : ''}
          </Col>
          <Col xs={3}>
            <ConnectedUserHomeTab />
          </Col>
        </Row>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    trees: state.trees
  }
}
const mapDispatch = dispatch => {
  return {
    fetchTrees: () => dispatch(fetchTrees()),
    fetchMyTrees: userId => dispatch(fetchMyTrees(userId))
  }
}

export default connect(mapState, mapDispatch)(UserHome)
