import React, {Component} from 'react'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux'

class Sidebar extends Component {
  render() {
    return (
      <div>
        <ul>
          <h3>Learning Tries</h3>
          <li id="learningTriesSidebar"> Machine Learning </li>
          <li id="learningTriesSidebar"> Film Photography Development </li>
          <li id="learningTriesSidebar"> Fighting Game Techniques </li>
        </ul>
      </div>
    )
  }
}

export const ConnectedSidebar = connect(null, null)(Sidebar)
