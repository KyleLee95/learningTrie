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
  componentDidMount() {
    // this.props.fetchTrees()
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={2}>
            <ConnectedSidebar trees={this.props.trees} />
          </Col>
          <Col xs={10} id="cy" />
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
