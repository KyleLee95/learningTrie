import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Row, Col, Button, Form} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {auth} from '../store'

class SignUp extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }
  render() {
    const {name, displayName, handleSubmit, error} = this.props
    return (
      <React.Fragment>
        <Row>
          <Col lg={7}>DEMO VIDEO LIVES HERE</Col>
          <Col lg={{span: 4, offset: 7}}>
            <Form onSubmit={handleSubmit} name={name}>
              <Form.Group as={Row}>
                <Form.Text style={{fontWeight: 'bold', fontSize: '20pt'}}>
                  Sign Up
                </Form.Text>
                <hr />
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Control name="email" type="email" placeholder="email" />
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Control
                  name="firstName"
                  type="name"
                  placeholder="first name"
                />
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Control
                  name="lastName"
                  type="name"
                  placeholder="last name"
                />
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Control
                  name="username"
                  type="username"
                  placeholder="username"
                />
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="password"
                />
              </Form.Group>
              <Form.Group as={Row}>
                <Button type="submit" variant="primary">
                  {displayName}
                </Button>
              </Form.Group>
              <hr />
              <Form.Group as={Row}>
                <Link to="/auth/google">
                  <Button>{displayName} with Google </Button>
                </Link>
              </Form.Group>
              {error && error.response && <div> {error.response.data} </div>}
            </Form>
          </Col>
        </Row>
      </React.Fragment>
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
