import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { github, gitee } from '@/components/platform'
import '@/styles/global.css'
import { commitInfo } from '@/dev'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/github">
            <Route path="commit" element={<github.Commit {...commitInfo} />} />
          </Route>
          <Route path="/gitee">
            <Route path="commit" element={<gitee.Commit {...commitInfo} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
