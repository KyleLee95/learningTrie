import React, {Component} from 'react'
import {Button, Popover, Form, OverlayTrigger} from 'react-bootstrap'
import {connect} from 'react-redux'

class SearchPopover extends Component {
  constructor(context, props) {
    super(props, context)
    this.state = {}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.name
    })
  }
  handleSubmit() {}

  render() {
    return (
      <OverlayTrigger
        trigger="click"
        placement="right"
        overlay={
          <Popover id="popover-basic" title="Popover right">
            <Form>
              <Form.Group controlId="formGroupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="SearchResource"
                  placeholder="Enter email"
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Button onClick={this.handleSubmit}>Search</Button>
            </Form>
          </Popover>
        }
      >
        <Button variant="primary">Search Resources</Button>
      </OverlayTrigger>
    )
  }
}

const mapDispatch = dispatch => {
  return {}
}
const mapState = state => {
  return {}
}

export const ConnectedSearchPopover = connect(mapState, mapDispatch)(
  SearchPopover
)
