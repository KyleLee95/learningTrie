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
          <Col xs={{span: 4, offset: 8}}>
            <Form onSubmit={handleSubmit} name={name}>
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

              {error && error.response && <div> {error.response.data} </div>}
            </Form>
          </Col>
        </Row>
        <a href="/auth/google">{displayName} with Google</a>
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

      dispatch(auth(email, password, formName))
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
