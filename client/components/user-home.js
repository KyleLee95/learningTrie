import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Row, Col, Button} from 'react-bootstrap'
import {ConnectedSidebar, ConnectedTreeVisualization} from '.'
// import {fetchTrees} from '../store/learningTree'

/**
 * COMPONENT
 */
class UserHome extends Component {
  // const {email} = props

  componentDidMount() {
    // this.props.fetchTrees()
    // console.log(this.props)
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
            <h1>Learning Trie Title</h1>
            {/* </Col> */}
            {/* </Row> */}
            {/* <Row> */}
            <ConnectedTreeVisualization />
            {/* </Row> */}
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
