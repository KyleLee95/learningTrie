import React from 'react'

import {ConnectedNav} from './components/navbar'
import Routes from './routes'

const App = () => {
  return (
    <div className="container-fluid" display="flex">
      <ConnectedNav />
      <Routes />
    </div>
  )
}

export default App
