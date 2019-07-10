/*eslint-disable complexity */
import React, {Component} from 'react'
import {Row, Col, Modal, Button, Form, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getSingleResourceTag} from '../store/resourceTag'
import {ConnectedResourceTagLineItem} from './ResourceTagLineItem'
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
              Resources also tagged with:{' '}
              {this.props.resourceTag &&
              this.props.resourceTag.title !== undefined
                ? this.props.resourceTag.title
                : ''}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {this.props.resourceTag.resources &&
            this.props.resourceTag.resources.length &&
            this.props.user !== undefined &&
            this.props.user.id !== undefined
              ? this.props.resourceTag.resources.map(resource => {
                  return (
                    <ConnectedResourceTagLineItem
                      key={resource.id}
                      resource={resource}
                    />
                    // <React.Fragment key={resource.id}>
                    //   <Card>
                    //     <Card.Body>
                    //       <Card.Title>
                    //         <Row>
                    //           <Col>
                    //             <React.Fragment>
                    //               <Link
                    //                 to={`/resource/${resource.id}`}
                    //                 style={{color: 'black'}}
                    //               >
                    //                 {resource.title} | Score:{' '}
                    //                 {resource && resource !== undefined
                    //                   ? resource.votes.filter(vote => {
                    //                       return vote.voteType === 'upvote'
                    //                     }).length -
                    //                     resource.votes.filter(vote => {
                    //                       return vote.voteType === 'downvote'
                    //                     }).length
                    //                   : null}
                    //               </Link>{' '}
                    //             </React.Fragment>
                    //           </Col>
                    //         </Row>
                    //       </Card.Title>
                    //       <Card.Subtitle className="text-muted">
                    //         {resource.description}
                    //       </Card.Subtitle>
                    //       <hr />
                    //       <Row>
                    //         <Col>
                    //           Tags:
                    //           {resource &&
                    //           resource.ResourceTags &&
                    //           resource.ResourceTags.length > 0
                    //             ? resource.ResourceTags.map(tag => {
                    //                 return (
                    //                   <Link to={`/tag/${tag.id}`} key={tag.id}>
                    //                     <Button size="sm" variant="light">
                    //                       {tag.title}{' '}
                    //                     </Button>
                    //                   </Link>
                    //                 )
                    //               })
                    //             : null}
                    //         </Col>
                    //       </Row>
                    //     </Card.Body>
                    //   </Card>
                    //   <br />
                    // </React.Fragment>
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
