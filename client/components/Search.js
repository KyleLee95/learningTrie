import React, {Component} from 'react'
import {Form, Button} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchSearchTrees} from '../store/learningTree'
import history from '../history'

class Search extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.fetchSearchTrees(`search=${this.state.search}`)
  }

  render() {
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="search">
            <Form.Control
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              name="search"
              type="search"
              placeholder="Search"
            />
          </Form.Group>

          <Button variant="submit" type="submit">
            Submit
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    fetchSearchTrees: search => dispatch(fetchSearchTrees(search))
  }
}

export const ConnectedSearch = connect(null, mapDispatch)(Search)
