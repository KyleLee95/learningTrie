import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {
  getSingleResource,
  delResource,
  putResource,
  postResource
} from '../store/resource'

class Resource extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }
  async componentDidMount() {
    await this.props.getSingleResource(Number(this.props.match.params.id))
  }
  render() {
    return (
      <div>
        <Row>
          <Button
            onClick={() =>
              this.props.delResource({resource: this.props.resource})
            }
          >
            Delete
          </Button>
          <Button>Edit</Button>
          <Col xs={12}>
            <Col xs={5}>
              <Row>
                {' '}
                <strong>Title:</strong> {this.props.resource.title}
              </Row>
            </Col>
            <Col xs={5}>
              <Row>
                {' '}
                <strong>Description:</strong>
                {this.props.resource.description}
              </Row>
            </Col>
            <Row>
              <Col xs={5}>
                {' '}
                <strong>Type:</strong> {this.props.resource.type}
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                {' '}
                <strong>Link:</strong>{' '}
                <a href={this.props.resource.link} target="_blank">
                  {this.props.resource.link}
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <strong>Comments here</strong>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleResource: resourceId => dispatch(getSingleResource(resourceId)),
    postResource: resource => dispatch(postResource(resource)),
    delResource: resource => dispatch(delResource(resource)),
    putResource: resource => dispatch(putResource(resource))
  }
}

const mapState = state => {
  return {
    resource: state.resource
  }
}

export const ConnectedResource = connect(mapState, mapDispatch)(Resource)
