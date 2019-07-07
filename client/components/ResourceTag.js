/*eslint-disable complexity */
import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getSingleResourceTag} from '../store/resourceTag'
class ResourceTag extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      show: false
    }
  }
  async componentDidMount() {
    await this.props.getSingleResourceTag(Number(this.props.match.params.id))
  }

  async componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      await this.props.getSingleResourceTag(Number(this.props.match.params.id))
    }
  }

  render() {
    return (
      //Proably wrong and I hate this but it works
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <h3>
              Resources also tagged with:
              {this.props.resourceTag &&
              this.props.resourceTag.title !== undefined
                ? this.props.resourceTag.title
                : ''}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={4}>
                    <Card.Title>Title </Card.Title>
                  </Col>
                  <Col xs={3}>
                    {' '}
                    <Card.Title>Description</Card.Title>
                  </Col>
                  <Col xs={1}>
                    <Card.Title>Rating</Card.Title>
                  </Col>
                  <Col xs={3}>
                    <Card.Title>Tags</Card.Title>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {this.props.resourceTag.resources &&
            this.props.resourceTag.resources.length
              ? this.props.resourceTag.resources.map(resource => {
                  return (
                    <Card key={resource.id}>
                      <Card.Body>
                        <Row>
                          <Col xs={4}>
                            <Link
                              style={{
                                textDecoration: 'none',
                                color: '#000000'
                              }}
                              to={`/resource/${resource.id}`}
                            >
                              <Card.Title>{resource.title} </Card.Title>
                            </Link>
                          </Col>

                          <Col xs={3}>
                            <Link
                              style={{
                                textDecoration: 'none',
                                color: '#000000'
                              }}
                              to={`/resource/${resource.id}`}
                            >
                              <Card.Title>{resource.description} </Card.Title>
                            </Link>
                          </Col>
                          <Col xs={1}>
                            <Link
                              style={{
                                textDecoration: 'none',
                                color: '#000000'
                              }}
                              to={`/resource/${resource.id}`}
                            >
                              <Card.Title>
                                {/* {resource.reviews.length > 0
                                  ? resource.reviews.reduce((acc, review) => {
                                      return review.rating + acc
                                    }, 0) / resource.reviews.length
                                  : 0}{' '} */}
                                / 5
                              </Card.Title>
                            </Link>
                          </Col>
                          <Col xs={3}>
                            <Card.Title>
                              {resource.ResourceTags &&
                              resource.ResourceTags.length > 0
                                ? resource.ResourceTags.map(tag => {
                                    return (
                                      <Link
                                        to={`/resourceTag/${tag.id}`}
                                        key={tag.id}
                                      >
                                        <Button size="sm" variant="light">
                                          {tag.title}
                                        </Button>
                                      </Link>
                                    )
                                  })
                                : null}
                            </Card.Title>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  )
                })
              : ''}
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleResourceTag: tagId => dispatch(getSingleResourceTag(tagId))
  }
}

const mapState = state => {
  return {
    user: state.currUser,
    resourceTag: state.resourceTag
  }
}

export const ConnectedResourceTag = connect(mapState, mapDispatch)(ResourceTag)
