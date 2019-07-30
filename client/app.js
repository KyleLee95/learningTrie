import React from 'react'

import {ConnectedNav} from './components/navbar'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <ConnectedNav />
      <Routes />
    </div>
  )
}

export default App
