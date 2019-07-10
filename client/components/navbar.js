import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link, NavLink} from 'react-router-dom'
import {logout} from '../store'
import {Navbar, Row, Col, Form, FormControl, Button} from 'react-bootstrap'
import {ConnectedSearch} from '.'

const Nav = ({handleClick, isLoggedIn, user}) => (
  <Row>
    {/* <Col xs={12}> */}
    <Navbar style={{backgroundColor: '#24292e', width: '100%'}}>
      <NavLink to="/" style={{color: 'white', textDecoration: 'none'}}>
        <h2>🌎pen Source Ed</h2>
      </NavLink>

      <ConnectedSearch />
      <Navbar.Collapse className="justify-content-end">
        {isLoggedIn ? (
          <React.Fragment>
            {/* The navbar will show these links after you log in */}
            <NavLink
              activestyle={{textDecoration: 'underline'}}
              style={{color: 'white'}}
              to="/"
            >
              Home
            </NavLink>
            {/* <Link to="/blog">Blog</Link> */}
            {/* <Link to="/explore">Explore</Link> */}
            {user.rank === 'admin' ? (
              <NavLink
                to="/admin"
                style={{color: 'white'}}
                activestyle={{textDecoration: 'underline'}}
              >
                Admin
              </NavLink>
            ) : null}
            {user.newMessage === true ? (
              <NavLink
                to="/inbox"
                style={{color: 'red'}}
                activestyle={{textDecoration: 'underline'}}
              >
                Inbox
              </NavLink>
            ) : (
              <NavLink
                to="/inbox"
                style={{color: 'white'}}
                activestyle={{textDecoration: 'underline'}}
              >
                Inbox
              </NavLink>
            )}
            <NavLink
              to={`/user/${user.id}`}
              style={{color: 'white'}}
              activestyle={{textDecoration: 'underline'}}
            >
              Profile
            </NavLink>
            <a
              href="#"
              onClick={handleClick}
              style={{color: 'white'}}
              activestyle={{textDecoration: 'underline'}}
            >
              Logout
            </a>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* The navbar will show these links before you log in */}

            <NavLink to="/login" style={{color: 'white'}}>
              Login
            </NavLink>

            <NavLink
              to="/signup"
              style={{color: 'white'}}
              activestyle={{textDecoration: 'underline'}}
            >
              <Button variant="outline-light">Sign Up</Button>
            </NavLink>
          </React.Fragment>
        )}
      </Navbar.Collapse>
    </Navbar>
    {/* </Col> */}
  </Row>
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
