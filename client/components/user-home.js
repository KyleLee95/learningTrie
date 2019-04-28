import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Row, Col, Button} from 'react-bootstrap'
import {ConnectedSidebar} from '.'
import {fetchTrees} from '../store/learningTree'
/**
 * COMPONENT
 */
class UserHome extends Component {
  // const {email} = props

  componentDidMount() {
    // this.props.fetchTrees()
  }
  render() {
    return (
      <div>
        {/* <h3>Welcome, {email}</h3> */}
        <Row>
          <Col xs={2}>
            <h1>Sidebar here</h1>
            <ConnectedSidebar />
          </Col>
          <Col xs={10} id="cy">
            {/* <Row> */}
            {/* <Col xs={{span: 6, offset: 3}}> */}
          </Col>
        </Row>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
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
