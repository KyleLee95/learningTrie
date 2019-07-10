import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {upvote, downvote, getVote} from '../store/vote'
import {unAssociateResourceFromNode} from '../store/resource'
import axios from 'axios'
import {getResourcesByNode} from '../store/resource'
class NodeResourceModalLineItem extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      score: 0,
      originalScore: 0,
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
      console.log(voteCheck)
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
    return (
      //conditional rendering for buttons based on upvote, downvote, none
      //check
      <li style={{listStyleType: 'none'}}>
        <Row>
          <Col xs={4}>
            <Row>
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
            </Row>
          </Col>
          <Col xs={8}>
            <Link to={`/resource/${this.props.resource.id}`}>
              {this.props.resource.title}
            </Link>{' '}
            ({this.props.resource.type})
            {this.props.auth === true ? (
              <Button
                variant="submit"
                size="sm"
                onClick={async () => {
                  await this.props.unAssociateResourceFromNode({
                    node: this.props.selected,
                    resource: this.props.resource
                  })
                }}
              >
                Remove
              </Button>
            ) : null}
          </Col>
        </Row>
      </li>
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
    getVote: resource => dispatch(getVote(resource)),
    unAssociateResourceFromNode: resource =>
      dispatch(unAssociateResourceFromNode(resource)),
    getResourcesByNode: resource => dispatch(getResourcesByNode(resource))
  }
}

export const ConnectedNodeResourceModalLineItem = connect(
  mapState,
  mapDispatch
)(NodeResourceModalLineItem)
