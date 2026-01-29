import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { github, gitee } from '@/components/platform'
import { commitInfo } from '@/dev'

import '@/styles/global.css'
import '@/styles/font.css'

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
