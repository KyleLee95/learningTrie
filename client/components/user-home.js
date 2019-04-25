import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Row, Col} from 'react-bootstrap'
import {ConnectedSidebar} from '.'
/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div>
      {/* <h3>Welcome, {email}</h3> */}
      <Row>
        <Col xs={4}>
          <h1>Sidebar here</h1>
          <ConnectedSidebar />
        </Col>
        <Col xs={8}>
          <h1>Learning Trie goes here</h1>
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
