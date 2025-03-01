import { useState } from 'react'
import Onboarding from './components/Onboarding'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Onboarding/>
    </>
  )
}

export default App
