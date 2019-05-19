import React, {Component} from 'react'
import {Form, Button} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

class Search extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  render() {
    return (
      <React.Fragment>
        <Form>
          <Form.Group controlId="search">
            <Form.Control
              onChange={this.handleChange}
              name="search"
              type="search"
              placeholder="Search"
            />
          </Form.Group>

          <Button variant="submit">Submit</Button>
        </Form>
      </React.Fragment>
    )
  }
}

export const ConnectedSearch = connect(null, null)(Search)
