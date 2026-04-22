import { HashRouter, Routes, Route } from 'react-router-dom'
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
import PersonContribution from './pages/PersonContribution'
import FollowEnterprise from './pages/FollowEnterprise'
import SceneEnterpriseDynamic from './pages/SceneEnterpriseDynamic'
import WaistEnterprise from './pages/WaistEnterprise'
import TopEnterpriseDynamic from './pages/TopEnterpriseDynamic'
import EnterpriseDynamic from './pages/EnterpriseDynamic'
import PlannedVisits from './pages/PlannedVisits'
import SceneEnterpriseDynamicDetail from './pages/SceneEnterpriseDynamicDetail'
import ScheduleDetail from './pages/ScheduleDetail'
import VisitDetail from './pages/VisitDetail'
import TopEnterpriseDynamicDetail from './pages/TopEnterpriseDynamicDetail'
import CompanyDetail from './pages/CompanyDetail'
import CompanyNewsDetail from './pages/CompanyNewsDetail'
import PreciseServiceDetail from './pages/PreciseServiceDetail'
import ServiceDispatch from './pages/ServiceDispatch'
import DailyMessageList from './pages/DailyMessageList'
import DailyMessageDetail from './pages/DailyMessageDetail'
import DailyMessageDetailInfo from './pages/DailyMessageDetailInfo'
import PdfPreview from './pages/PdfPreview'
import EnterpriseChangeList from './pages/EnterpriseChangeList'
import KeyEnterprises from './pages/KeyEnterprises'
import ServiceDepartment from './pages/ServiceDepartment'
import EnterpriseExcavation from './pages/EnterpriseExcavation'
import './index.css'

function App() {
  return (
    <HashRouter>
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
        <Route path="/person-contribution" element={<PersonContribution />} />
        <Route path="/follow-enterprise" element={<FollowEnterprise />} />
        <Route path="/scene-enterprise-dynamic" element={<SceneEnterpriseDynamic />} />
        <Route path="/waist-enterprise" element={<WaistEnterprise />} />
        <Route path="/top-enterprise-dynamic" element={<TopEnterpriseDynamic />} />
        <Route path="/enterprise-dynamic" element={<EnterpriseDynamic />} />
        <Route path="/planned-visits" element={<PlannedVisits />} />
        <Route path="/scene-enterprise-dynamic-detail/:id" element={<SceneEnterpriseDynamicDetail />} />
        <Route path="/schedule-detail" element={<ScheduleDetail />} />
        <Route path="/enterprise-dynamic-detail/:id" element={<VisitDetail />} />
        <Route path="/top-enterprise-dynamic-detail/:id" element={<TopEnterpriseDynamicDetail />} />
        <Route path="/company-detail/:id" element={<CompanyDetail />} />
        <Route path="/company-news-detail/:id" element={<CompanyNewsDetail />} />
        <Route path="/precise-service-detail/:id" element={<PreciseServiceDetail />} />
        <Route path="/service-dispatch" element={<ServiceDispatch />} />
        <Route path="/daily-messages" element={<DailyMessageList />} />
        <Route path="/daily-message-detail/:id" element={<DailyMessageDetail />} />
        <Route path="/daily-message-detail-info/:id" element={<DailyMessageDetailInfo />} />
        <Route path="/pdf-preview" element={<PdfPreview />} />
        <Route path="/enterprise-change-list" element={<EnterpriseChangeList />} />
        <Route path="/key-enterprises/:regionType" element={<KeyEnterprises />} />
        <Route path="/service-departments" element={<ServiceDepartment />} />
        <Route path="/enterprise-excavation/:id" element={<EnterpriseExcavation />} />
      </Routes>
    </HashRouter>
  )
}

export default App
