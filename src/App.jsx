import { Outlet } from 'react-router-dom'
import './App.css'

export default function Root() {
  

  return (
    <>
     <main>
      <p>hello</p>
      <Outlet />
     </main>
    </>
  )
}


