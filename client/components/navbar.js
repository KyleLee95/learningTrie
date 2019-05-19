import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Navbar, Form, FormControl, Button} from 'react-bootstrap'
import {logout} from '../store'
// import {ConnectedSearch} from '.'
const Nav = (isLoggedIn, handleClick) => (
  <div>
    <h1>Learning 🌳 Tree</h1>
    <nav>
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to="/home">Home</Link>
          <Link to="/explore">Explore</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
          {/* <ConnectedSearch /> */}
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          {/* <ConnectedSearch /> */}
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export const ConnectedNav = connect(mapState, mapDispatch)(Nav)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
