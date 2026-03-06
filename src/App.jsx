import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EnterpriseCalendar from './pages/EnterpriseCalendar'
import SceneCalendar from './pages/SceneCalendar'
import TagCalendar from './pages/TagCalendar'
import EnterpriseList from './pages/EnterpriseList'
import SceneRadar from './pages/SceneRadar'
import SceneEnterprise from './pages/SceneEnterprise'
import SceneDescription from './pages/SceneDescription'
import PolicyList from './pages/PolicyList'
import DataContribution from './pages/DataContribution'
import FollowEnterprise from './pages/FollowEnterprise'
import SceneEnterpriseDynamic from './pages/SceneEnterpriseDynamic'
import TopEnterpriseDynamic from './pages/TopEnterpriseDynamic'
import EnterpriseDynamic from './pages/EnterpriseDynamic'
import PlannedVisits from './pages/PlannedVisits'
import SceneEnterpriseDynamicDetail from './pages/SceneEnterpriseDynamicDetail'
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
        <Route path="/policy-list" element={<PolicyList />} />
        <Route path="/data-contribution" element={<DataContribution />} />
        <Route path="/follow-enterprise" element={<FollowEnterprise />} />
        <Route path="/scene-enterprise-dynamic" element={<SceneEnterpriseDynamic />} />
        <Route path="/top-enterprise-dynamic" element={<TopEnterpriseDynamic />} />
        <Route path="/enterprise-dynamic" element={<EnterpriseDynamic />} />
        <Route path="/planned-visits" element={<PlannedVisits />} />
        <Route path="/scene-enterprise-dynamic-detail/:id" element={<SceneEnterpriseDynamicDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
