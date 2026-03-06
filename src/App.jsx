import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EnterpriseCalendar from './pages/EnterpriseCalendar'
import SceneCalendar from './pages/SceneCalendar'
import TagCalendar from './pages/TagCalendar'
import EnterpriseList from './pages/EnterpriseList'
import SceneRadar from './pages/SceneRadar'
import SceneEnterprise from './pages/SceneEnterprise'
import SceneDescription from './pages/SceneDescription'
import DataContribution from './pages/DataContribution'
import FollowEnterprise from './pages/FollowEnterprise'
import SceneEnterpriseDynamic from './pages/SceneEnterpriseDynamic'
import './index.css'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<EnterpriseCalendar />} />
        <Route path="/scene-calendar" element={<SceneCalendar />} />
        <Route path="/tag-calendar" element={<TagCalendar />} />
        <Route path="/enterprise-list" element={<EnterpriseList />} />
        <Route path="/scene-radar" element={<SceneRadar />} />
        <Route path="/scene-enterprise" element={<SceneEnterprise />} />
        <Route path="/scene-description/:id" element={<SceneDescription />} />
        <Route path="/data-contribution" element={<DataContribution />} />
        <Route path="/follow-enterprise" element={<FollowEnterprise />} />
        <Route path="/scene-enterprise-dynamic" element={<SceneEnterpriseDynamic />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
