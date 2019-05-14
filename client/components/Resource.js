import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form} from 'react-bootstrap'
import {connect} from 'react-redux'
import {ConnectedTreeVisualization, ConnectedSidebar} from '.'
import {getSingleResource, postResource} from '../store/resource'

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
            <Col xs={12}>
              {' '}
              <strong>Type:</strong> {this.props.resource.type}
            </Col>
          </Col>
          <Row>
            <Col xs={{span: 12, offset: 4}}>
              <strong>Comments here</strong>
            </Col>
          </Row>
        </Row>
      </div>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleResource: resourceId => dispatch(getSingleResource(resourceId)),
    postResource: resource => dispatch(postResource(resource))
  }
}

const mapState = state => {
  return {
    resource: state.resource
  }
}

export const ConnectedResource = connect(mapState, mapDispatch)(Resource)
