import React from 'react'
import Header from './components/Header'
import Main from './components/Main'
import Subscriptions from './components/Subscriptions'
import Groups from './components/Groups'
import Feeds from './components/Feeds'
import Abc from './components/Abc'
import GroupsPane from './components/GroupsPane'
import FeedsLayout from './components/FeedsLayout'

import { Route,  Link } from 'react-router-dom'
import styles from './styles.css'


const main = () => {
  return <Main>
      <Subscriptions/>    
      <Groups/>
    </Main>
}


const feeds = () => {
  return <FeedsLayout>
    <GroupsPane/>
    <Feeds/>
  </FeedsLayout>
}   

const login = () => {
  return <div><Abc/></div>
}

const App = () => (
  <div>
    <Header>       
      <Link to='/'>Organize</Link>
      <Link to='/feeds'>Feeds</Link>
    </Header>       
      <Route exact path='/' component={main} />
      <Route path='/feeds' component={feeds} /> 
      {/* <Route path='/login' component={login} /> */}
  </div>)

export default App
