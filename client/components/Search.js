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
      <form onSubmit={this.handleSubmit}>
        {/* <Form.Group controlId="search" className="bg-dark"> */}
        <input
          onChange={this.handleChange}
          name="search"
          type="search"
          placeholder=" Search"
          className="bg-dark"
          size="lg"
          style={{
            backgroundColor: '#24292F',
            border: '0px solid #24292F',
            borderRadius: '5px',
            color: 'white'
          }}
        />
        {/* </Form.Group> */}
      </form>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    fetchSearchTrees: search => dispatch(fetchSearchTrees(search))
  }
}

export const ConnectedSearch = connect(null, mapDispatch)(Search)
