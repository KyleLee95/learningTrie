import React, {Component} from 'react'
import {ConnectedUserHomeTab, ConnectedSidebar, ConnectedNewTree} from '.'
import {connect} from 'react-redux'
import {Row, Col, Button, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {fetchTrees} from '../store/learningTree'
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
              <Button>Trees Shared With Me</Button>
              <Button>Favorite Trees</Button>
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
              ? this.props.user.learningTrees
                  .filter(tree => tree.userId === this.props.user.id)
                  .map(tree => {
                    return (
                      <Card key={tree.id}>
                        <Card.Body>
                          <Link to={`/learningTree/${tree.id}`}>
                            <Row>
                              <Col xs={4}>
                                <Card.Title>{tree.title} </Card.Title>
                              </Col>
                              <Col xs={2}>
                                <Card.Title>{tree.userId} </Card.Title>
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
    fetchTrees: () => dispatch(fetchTrees())
  }
}

export default connect(mapState, mapDispatch)(UserHome)
