import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, NavLink} from 'react-router-dom'
import {
  Row,
  Col,
  Button,
  Form,
  Carousel,
  Jumbotron,
  Navbar
} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {auth} from '../store'
import ReactPlayer from 'react-player'
import ScrollLock from 'react-scrolllock/dist/ScrollLock'

class SignUp extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }
  render() {
    const {name, displayName, handleSubmit, error} = this.props
    return (
      // <Row>
      <React.Fragment>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <Carousel style={{paddingTop: '10%'}}>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="/carousel0.png"
                  alt="Welcome"
                />
                {/* <Carousel.Caption> */}
                {/* <h3 style={{color: 'black'}}>🌎pen Source Ed</h3>
                <p style={{color: 'black'}}>
                  A community driven learning platform and visualization tool
                  that helps you see what you're learning.
                </p>
                </Carousel.Caption> */}
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="/carousel1.png"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="/carousel2.png"
                  alt="Second slide"
                />
              </Carousel.Item>
            </Carousel>
          </Col>

          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <Row>
              <Col xs={{span: 10, offset: 1}}>
                <Form onSubmit={handleSubmit} name={name}>
                  <Form.Group as={Row}>
                    <Form.Text style={{fontWeight: 'bold', fontSize: '20pt'}}>
                      Sign Up
                    </Form.Text>
                    <hr />
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      type="Email"
                      placeholder="Email"
                    />
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      name="firstName"
                      type="name"
                      placeholder="First Name"
                    />
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      name="lastName"
                      type="name"
                      placeholder="Last Name"
                    />
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      name="username"
                      type="username"
                      placeholder="Username"
                    />
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Button type="submit" variant="primary">
                      {displayName}
                    </Button>
                  </Form.Group>

                  {error &&
                    error.response && <div> {error.response.data} </div>}
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
      // </Row>
    )
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.currUser.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      const firstName = evt.target.firstName.value
      const lastName = evt.target.lastName.value
      const username = evt.target.username.value
      const dbUsername = evt.target.username.value.toLowerCase()

      dispatch(
        auth(
          email,
          password,
          firstName,
          lastName,
          username,
          dbUsername,
          formName
        )
      )
    }
  }
}

/**
 * PROP TYPES
 */
SignUp.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}

export const ConnectedSignUp = connect(mapSignup, mapDispatch)(SignUp)
