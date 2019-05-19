import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Navbar, Form, FormControl, Button} from 'react-bootstrap'
import {logout} from '../store'
import {ConnectedSearch} from '.'
class Nav extends Component {
  render() {
    return (
      <Navbar>
        <h1>Learning 🌳 Tree</h1>

        {this.isLoggedIn ? (
          <React.Fragment>
            {/* The navbar will show these links after you log in */}
            <Link to="/home">Home</Link>
            <Link to="/explore">Explore</Link>
            <a href="#" onClick={this.handleClick}>
              Logout
            </a>
            <ConnectedSearch />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* The navbar will show these links before you log in */}
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <ConnectedSearch />
          </React.Fragment>
        )}
      </Navbar>
    )
  }
}

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
// Navbar.propTypes = {
//   handleClick: PropTypes.func.isRequired,
//   isLoggedIn: PropTypes.bool.isRequired
// }
