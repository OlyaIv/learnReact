import './App.module.css'
import { Route , Routes, Link  } from 'react-router-dom'
import HomePage from './pages/Home'
import AboutMePage from './pages/AboutYou'
import ErrorPage from './pages/Error'

function App() {

  return (
<>
<header>
<nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/aboutme">About Me</Link></li>
        <li><Link to="/greeting">Greeting</Link></li>
      </ul>
    </nav>
</header>

        <Routes>
          <Route path="/" element={<HomePage/>}/> 
          <Route path="/aboutme" element={<AboutMePage/>}/>
          <Route path="/greeting" element={<h1>Hi!</h1>}/>
          <Route path="*" element={<ErrorPage/>}/>
    </Routes>
</>

  )
}

export default App
