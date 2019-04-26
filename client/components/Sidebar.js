import React, {Component} from 'react'
import {Row, Col, DropdownButton, Dropdown} from 'react-bootstrap'
import {connect} from 'react-redux'

//Can refactor into function component and get everything from state.
//TODO:
//Thunk + reducer for getting all tries.

class Sidebar extends Component {
  render() {
    return (
      <div>
        <DropdownButton id="dropdown-basic-button" title="Learning Tries">
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </DropdownButton>

        {/* <ul>
          <h3>Learning Tries</h3>
          <li id="learningTriesSidebar"> Machine Learning </li>
          <li id="learningTriesSidebar"> Film Photography Development </li>
          <li id="learningTriesSidebar"> Fighting Game Techniques </li>
        </ul> */}
      </div>
    )
  }
}

export const ConnectedSidebar = connect(null, null)(Sidebar)
