import React from 'react'

import {ConnectedNav} from './components/navbar'
import Routes from './routes'

const App = () => {
  return (
    <div className="container-fluid" style={{height: '100%'}}>
      <ConnectedNav />

      <Routes />
    </div>
  )
}

export default App
