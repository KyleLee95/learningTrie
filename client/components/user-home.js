import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Row, Col} from 'react-bootstrap'
import {ConnectedSidebar, TrieVisualization} from '.'
/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div>
      {/* <h3>Welcome, {email}</h3> */}
      <Row>
        <Col xs={2}>
          <h1>Sidebar here</h1>
          <ConnectedSidebar />
        </Col>
        <Col xs={10} id="cy">
          <Row>
            <Col xs={{span: 6, offset: 3}}>
              <h1>Learning Trie Title</h1>
            </Col>
          </Row>
          <Row>
            <TrieVisualization />
          </Row>
        </Col>
      </Row>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
