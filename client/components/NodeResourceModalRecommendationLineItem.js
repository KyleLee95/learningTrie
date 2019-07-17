import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col, Button, Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {upvote, downvote, getVote} from '../store/vote'
import {
  getRecommendationVote,
  downvoteRecommendation,
  upvoteRecommendation
} from '../store/vote'
import {getLink} from '../store/link'
class NodeResourceModalRecommendationLineItem extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      score: 0,
      originalScore: 0,
      voteType: 'none'
    }
  }

  async componentDidMount() {
    await this.props.getRecommendationVote(this.props.recommendation.link)
    this.setState({
      score: this.props.recommendation.score,
      voteType: this.props.vote.voteType
    })
    if (this.props.vote.voteType === undefined) {
      this.setState({
        voteType: 'none'
      })
    }
  }

  render() {
    return (
      <li style={{listStyleType: 'none'}}>
        <hr />
        <Row>
          <Col xs={12}>
            {this.props.user.id === undefined ? (
              <Button variant="submit" sz="sm">
                {this.state.score} pts.
              </Button>
            ) : (
              <React.Fragment>
                {this.state.voteType === 'upvote' ? (
                  //deletes an upvote
                  <Button
                    variant="success"
                    sz="sm"
                    onClick={async () => {
                      await this.props.upvoteRecommendation({
                        recommendation: this.props.recommendation,
                        voteType: 'upvote'
                      })
                      this.setState({
                        voteType: 'none',
                        score: this.state.score - 1
                      })
                      await this.props.getRecommendationVote(
                        this.props.recommendation.link
                      )
                    }}
                  >
                    +
                  </Button>
                ) : (
                  //posts the upvote

                  <Button
                    variant="outline-secondary"
                    sz="sm"
                    onClick={async () => {
                      await this.props.upvoteRecommendation({
                        recommendation: this.props.recommendation,
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
                      await this.props.getRecommendationVote(
                        this.props.recommendation.link
                      )
                    }}
                  >
                    +
                  </Button>
                )}
                {/* Shows Score */}
                <Button variant="submit" sz="sm">
                  {this.state.score} pts.
                </Button>
                {this.state.voteType === 'downvote' ? (
                  //deletes downvote

                  <Button
                    variant="danger"
                    sz="sm"
                    onClick={async () => {
                      await this.props.downvoteRecommendation({
                        recommendation: this.props.recommendation,
                        voteType: 'downvote'
                      })
                      this.setState({
                        voteType: 'none',
                        score: this.state.score + 1
                      })
                      await this.props.getRecommendationVote(
                        this.props.recommendation.link
                      )
                    }}
                  >
                    -
                  </Button>
                ) : (
                  //posts a downvote

                  <Button
                    variant="outline-secondary"
                    sz="sm"
                    onClick={async () => {
                      await this.props.downvoteRecommendation({
                        recommendation: this.props.recommendation,
                        voteType: 'none'
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
                      await this.props.getRecommendationVote(
                        this.props.recommendation.link
                      )
                    }}
                  >
                    -
                  </Button>
                )}
                {'  '}
                <Link to={`/recommendation/${this.props.recommendation.id}`}>
                  {this.props.recommendation.title}
                </Link>{' '}
                ({this.props.recommendation.type}) by{' '}
                <Link to={`/user/${this.props.recommendation.owner.id}`}>
                  {this.props.recommendation.owner}
                </Link>
              </React.Fragment>
            )}
          </Col>
        </Row>
      </li>
    )
  }
}

const mapState = state => {
  return {
    vote: state.vote,
    user: state.currUser,
    link: state.link
  }
}

const mapDispatch = dispatch => {
  return {
    getRecommendationVote: recommendationId =>
      dispatch(getRecommendationVote(recommendationId)),
    downvoteRecommendation: recommendation =>
      dispatch(downvoteRecommendation(recommendation)),
    upvoteRecommendation: recommendation =>
      dispatch(upvoteRecommendation(recommendation))
  }
}

export const ConnectedNodeResourceModalRecommendationLineItem = connect(
  mapState,
  mapDispatch
)(NodeResourceModalRecommendationLineItem)
