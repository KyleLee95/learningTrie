import React, {Component} from 'react'
import {Form, Button} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchSearchTrees} from '../store/learningTree'

class Search extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.fetchSearchTrees(`search=${this.state.search}`)
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
          <Button variant="submit" onClick={this.handleSubmit}>
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
