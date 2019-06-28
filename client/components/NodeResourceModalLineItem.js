import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {upvote, downvote, getVote} from '../store/vote'
import {unAssociateResourceFromNode} from '../store/resource'
import axios from 'axios'
class NodeResourceModalLineItem extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      score: 0
    }
  }
  componentDidMount() {
    if (this.props.resource !== undefined) {
      const upvotes = this.props.resource.votes.filter(vote => {
        return vote.voteType === 'upvote'
      })
      const downvotes = this.props.resource.votes.filter(vote => {
        return vote.voteType === 'downvote'
      })
      let resourceScore = upvotes - downvotes
      this.setState({
        score: resourceScore
      })
      // const res = await axios.get(`/api/votes/${this.props.resource.id}`)
      // this.setState({
      //   votes: res.data
      // })
      // console.log(this.state.votes)
      // await this.props.getVote(this.props.resource)
    }
  }

  // async componentDidUpdate(prevProps) {
  //   if (this.props.resource.id !== prevProps.resource.id) {
  //     await this.props.getVote(this.props.resource)
  //   }
  // }
  render() {
    return (
      //conditional rendering for buttons based on upvote, downvote, none
      <li style={{listStyleType: 'none'}}>
        <Row>
          <Col xs={4}>
            <Row>
              {this.props.vote.voteType === 'upvote' ? (
                <Button
                  variant="sucesss"
                  sz="sm"
                  onClick={async () => {
                    if (this.props.vote.voteType === 'none') {
                      this.props.resource.score = this.props.resource.score + 1
                      await this.props.upvote({
                        resource: this.props.resource,
                        voteType: 'none'
                      })
                    } else if (this.props.vote.voteType === 'upvote') {
                      await this.props.upvote({
                        resource: this.props.resource,
                        voteType: 'upvote'
                      })
                    }
                    //if class-name = clicked => call downvote and set classname to be unclicked
                    //else, set classname = clicked and call upvote
                  }}
                >
                  +
                </Button>
              ) : (
                <Button
                  variant="submit"
                  sz="sm"
                  onClick={async () => {
                    console.log('A')
                    console.log(this.props.vote.voteType)
                    if (this.props.vote.voteType === 'none') {
                      console.log('B')
                      this.props.resource.score = this.props.resource.score + 1
                      await this.props.upvote({
                        resource: this.props.resource,
                        voteType: 'upvote'
                      })
                    } else if (this.props.vote.voteType === 'upvote') {
                      console.log('C')
                      await this.props.upvote({
                        resource: this.props.resource,
                        voteType: 'none'
                      })
                    }
                    //if class-name = clicked => call downvote and set classname to be unclicked
                    //else, set classname = clicked and call upvote
                  }}
                >
                  +
                </Button>
              )}

              <Button variant="submit" sz="sm">
                {this.state.score} pts.
              </Button>
              <Button
                variant="submit"
                sz="sm"
                className="unClicked"
                // onClick={async () => {
                //   if (down.className === 'unClicked btn btn-submit') {
                //     down.className = 'clicked'
                //     this.props.resource.score = this.props.resource.score - 1
                //     await this.props.downvote(this.props.resource)
                //     return null
                //   } else if (down.className === 'clicked') {
                //     down.className = 'unClicked'
                //     await this.props.downvote(this.props.resource)
                //     return null
                //   }
                // }}
              >
                -
              </Button>
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
                  await this.props.getResourcesByNode(this.props.selected)
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
    vote: state.vote
  }
}

const mapDispatch = dispatch => {
  return {
    upvote: resource => dispatch(upvote(resource)),
    downvote: resource => dispatch(downvote(resource)),
    getVote: resource => dispatch(getVote(resource)),
    unAssociateResourceFromNode: resource =>
      dispatch(unAssociateResourceFromNode(resource))
  }
}

export const ConnectedNodeResourceModalLineItem = connect(
  mapState,
  mapDispatch
)(NodeResourceModalLineItem)
