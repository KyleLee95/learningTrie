import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  ConnectedLogin,
  ConnectedSignUp,
  UserHome,
  ConnectedLearningTree,
  ConnectedResource,
  ConnectedReview,
  // ConnectedBlog,
  ConnectedTag,
  ConnectedSearchResult,
  ConnectedUserProfile,
  ConnectedInbox,
  ConnectedRecommendation,
  ConnectedExplore,
  ConnectedConversation,
  ConnectedResourceTag,
  ConnectedAdminControl
} from './components'
import {me} from './store'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/search" component={ConnectedSearchResult} />
        <Route path="/login" component={ConnectedLogin} />
        <Route path="/signup" component={ConnectedSignUp} />
        <Route
          exact
          path="/learningTree/:id"
          component={ConnectedLearningTree}
        />
        <Route path="/resource/:id" component={ConnectedResource} />
        <Route
          exact
          path="/learningTree/:id/review"
          component={ConnectedReview}
        />
        <Route path="/resourceTag/:id" component={ConnectedResourceTag} />
        <Route path="/explore" component={ConnectedExplore} />
        <Route exact path="/tag/:id" component={ConnectedTag} />
        <Route path="/user/:id" component={ConnectedUserProfile} />
        <Route path="/recommendation/:id" component={ConnectedRecommendation} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route exact path="/" component={UserHome} />
            <Route path="/home" component={UserHome} />
            <Route path="/inbox" component={ConnectedInbox} />
            <Route path="/conversation/:id" component={ConnectedConversation} />
            <Route path="/admin" component={ConnectedAdminControl} />
          </Switch>
        )}

        {/* Displays our Login component as a fallback */}
        <Route component={ConnectedSignUp} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.currUser.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
