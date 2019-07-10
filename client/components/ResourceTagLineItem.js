import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {upvote, downvote, getVote} from '../store/vote'

class ResourceTagLineItem extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      score: 0,
      voteType: 'none'
    }
  }

  componentDidMount() {
    let voteCheck = []
    if (
      this.props.resource !== undefined &&
      this.props.resource.votes !== undefined &&
      this.props.user !== undefined &&
      this.props.user.id !== undefined
    ) {
      const upvotes = this.props.resource.votes.filter(vote => {
        return vote.voteType === 'upvote'
      })
      const downvotes = this.props.resource.votes.filter(vote => {
        return vote.voteType === 'downvote'
      })
      let resourceScore = upvotes.length - downvotes.length
      this.setState({
        score: resourceScore,
        originalScore: resourceScore
      })
      voteCheck = this.props.resource.votes.filter(vote => {
        return vote.userId === this.props.user.id
      })
    }

    if (voteCheck.length > 0) {
      this.setState({
        voteType: voteCheck[0].voteType
      })
    } else
      this.setState({
        voteType: 'none'
      })
  }

  render() {
    const resource = this.props.resource
    return (
      <React.Fragment>
        <Card>
          <Card.Body>
            <Card.Title>
              <Row>
                <Col>
                  <React.Fragment>
                    <Link
                      to={`/resource/${resource.id}`}
                      style={{color: 'black'}}
                    >
                      {resource.title} | Score:{' '}
                    </Link>{' '}
                    {this.state.voteType === 'upvote' ? (
                      //deletes an upvote
                      <Button
                        variant="success"
                        sz="sm"
                        onClick={async () => {
                          await this.props.upvote({
                            resource: this.props.resource,
                            voteType: 'upvote'
                          })
                          this.setState({
                            voteType: 'none',
                            score: this.state.score - 1
                          })
                        }}
                      >
                        +
                      </Button>
                    ) : (
                      //posts the upvote
                      <Button
                        variant="submit"
                        sz="sm"
                        onClick={async () => {
                          await this.props.upvote({
                            resource: this.props.resource,
                            voteType: 'none'
                          })
                          if (this.state.voteType === 'none') {
                            this.setState({
                              voteType: 'upvote',
                              score: this.state.score + 1
                            })
                          } else if (this.state.voteType === 'downvote') {
                            this.setState({
                              voteType: 'upvote',
                              score: this.state.score + 2
                            })
                          }
                        }}
                      >
                        +
                      </Button>
                    )}
                    <Button variant="submit" sz="sm">
                      {this.state.score} pts.
                    </Button>
                    {this.state.voteType === 'downvote' ? (
                      //deletes downvote
                      <Button
                        variant="danger"
                        sz="sm"
                        onClick={async () => {
                          await this.props.downvote({
                            resource: this.props.resource,
                            voteType: 'none'
                          })
                          this.setState({
                            voteType: 'none',
                            score: this.state.score + 1
                          })
                        }}
                      >
                        -
                      </Button>
                    ) : (
                      //posts a downvote
                      <Button
                        variant="submit"
                        sz="sm"
                        onClick={async () => {
                          await this.props.downvote({
                            resource: this.props.resource,
                            voteType: 'downvote'
                          })
                          if (this.state.voteType === 'upvote') {
                            this.setState({
                              voteType: 'downvote',
                              score: this.state.score - 2
                            })
                          } else if (this.state.voteType === 'none') {
                            this.setState({
                              voteType: 'downvote',
                              score: this.state.score - 1
                            })
                          }
                        }}
                      >
                        -
                      </Button>
                    )}
                  </React.Fragment>
                </Col>
              </Row>
            </Card.Title>
            <Card.Subtitle className="text-muted">
              {resource.description}
            </Card.Subtitle>
            <hr />
            <Row>
              <Col>
                Tags:
                {resource &&
                resource.ResourceTags &&
                resource.ResourceTags.length > 0
                  ? resource.ResourceTags.map(tag => {
                      return (
                        <Link to={`/tag/${tag.id}`} key={tag.id}>
                          <Button size="sm" variant="light">
                            {tag.title}{' '}
                          </Button>
                        </Link>
                      )
                    })
                  : null}
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <br />
      </React.Fragment>
    )
  }
}

const mapState = state => {
  return {
    vote: state.vote,
    user: state.currUser
  }
}

const mapDispatch = dispatch => {
  return {
    upvote: resource => dispatch(upvote(resource)),
    downvote: resource => dispatch(downvote(resource)),
    getVote: resource => dispatch(getVote(resource))
  }
}

export const ConnectedResourceTagLineItem = connect(mapState, mapDispatch)(
  ResourceTagLineItem
)
