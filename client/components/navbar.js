import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {Navbar, Row, Col, Button} from 'react-bootstrap'
import {ConnectedSearch} from '.'
const Nav = ({handleClick, isLoggedIn, user}) => (
  <Navbar>
    <Link to="/" style={{color: 'black', textDecoration: 'none'}}>
      <h2>🌎pen Source Ed</h2>
    </Link>

    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      {isLoggedIn ? (
        <React.Fragment>
          {/* The navbar will show these links after you log in */}
          <ConnectedSearch />
          <Link to="/">Home</Link>
          {/* <Link to="/blog">Blog</Link> */}
          <Link to="/explore">Explore</Link>
          {user.newMessage === true ? (
            <Link to="/inbox" style={{color: 'red'}}>
              Inbox
            </Link>
          ) : (
            <Link to="/inbox">Inbox</Link>
          )}
          <Link to={`/user/${user.id}`}>Profile</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* The navbar will show these links before you log in */}

          <Link to="/login">Login</Link>

          <Link to="/signup">Sign Up</Link>
        </React.Fragment>
      )}
    </Navbar.Collapse>
  </Navbar>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.currUser.id,
    user: state.currUser
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick: () => dispatch(logout())
  }
}

export const ConnectedNav = connect(mapState, mapDispatch)(Nav)

/**
 * PROP TYPES
 */
Nav.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
