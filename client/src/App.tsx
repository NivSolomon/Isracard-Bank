import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Layout from './layouts/Layout'
import ToastComponent from './components/toasts/ToastComponent'

function App() {

  return (
    <BrowserRouter>
      <ToastComponent />
      <Routes>
        <Route path='/' element={<Layout><SignIn/></Layout>}/>
        <Route path='/home' element={<Layout><Home/></Layout>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
