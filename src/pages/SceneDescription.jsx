import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import iconPublisher from '../assets/icon-scene-publisher.svg';
import PageHeader from '../components/PageHeader';
import iconCalendar from '../assets/icon-scene-calendar.svg';
import iconGoalCheck from '../assets/icon-scene-goal-check.svg';
import './SceneDescription.css';
import { getSceneReleaseInfo } from '../api/enterprise';

const DEFAULT_DATA = {
  name: '场景说明',
  publisher: '发布单位：--',
  publishDate: '发布时间：--',
  policies: [],
  description: '',
  goals: [],
  scopeDesc: '',
  scopeTags: [],
};

const handleDownload = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const urlObject = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlObject;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(urlObject);
  } catch {
    window.open(url, '_blank');
  }
};

function mapSceneDescriptionData(apiData, sceneName) {
  if (!apiData) {
    return {
      ...DEFAULT_DATA,
      name: sceneName || DEFAULT_DATA.name,
    };
  }

  return {
    name: apiData.titleName || sceneName || DEFAULT_DATA.name,
    publisher: `发布单位：${apiData.releaseUnit || '--'}`,
    publishDate: `发布时间：${apiData.publishTime || '--'}`,
    policies: Array.isArray(apiData.attachmentList)
      ? apiData.attachmentList
          .filter(item => item?.attachmentName || item?.attachmentPath)
          .map(item => ({
            doc: item.attachmentName || '附件',
            url: item.attachmentPath || '',
          }))
      : [],
    description: apiData.publishBackground || '',
    goals: Array.isArray(apiData.workList) ? apiData.workList.filter(Boolean) : [],
    scopeDesc: apiData.workScope || '',
    scopeTags: Array.isArray(apiData.tagNameList) ? apiData.tagNameList.filter(Boolean) : [],
  };
}

export default function SceneDescription() {
  const { id } = useParams();
  const location = useLocation();
  const sceneName = location.state?.sceneName;
  const [data, setData] = useState({
    ...DEFAULT_DATA,
    name: sceneName || DEFAULT_DATA.name,
  });

  useEffect(() => {
    if (!id) return;

    getSceneReleaseInfo({ id: Number(id) })
      .then(response => {
        setData(mapSceneDescriptionData(response.data, sceneName));
      })
      .catch(error => {
        console.error('场景说明加载失败:', error);
        setData({
          ...DEFAULT_DATA,
          name: sceneName || DEFAULT_DATA.name,
        });
      });
  }, [id, sceneName]);

  return (
    <div className="sd-container">
      <PageHeader title="场景说明" />

      <div className="sd-content">
        <div className="sd-card">
          <div className="sd-card-content">
            <div className="sd-info-header">
              <div className="sd-scene-title">{data.name}</div>
              <div className="sdd-meta-row">
                <div className="sd-meta-item">
                  <img src={iconPublisher} alt="发布单位" width={12} height={12} />
                  <span className="sd-meta-text">{data.publisher}</span>
                </div>
                <div className="sd-meta-item">
                  <img src={iconCalendar} alt="发布时间" width={12} height={12} />
                  <span className="sd-meta-text">{data.publishDate}</span>
                </div>
              </div>
            </div>

            <div className="sd-separator" />

            {data.policies.length > 0 && (
              <div className="sd-policy-box">
                <div className="sd-policy-title">政策依据:</div>
                <div className="sd-policies-list">
                  {data.policies.map((policy, index) => (
                    <a
                      key={`${policy.doc}-${index}`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (policy.url) {
                          handleDownload(policy.url, policy.doc);
                        }
                      }}
                      className="sd-policy-item"
                    >
                      {policy.doc}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="sd-desc-section">
              <p className="sd-desc-text">{data.description || '--'}</p>
            </div>
          </div>
        </div>

        <div className="sd-card">
          <div className="sd-card-content">
            <div className="sd-section-header">
              <span className="sd-dot sd-dot--success" />
              <span className="sd-section-title">工作目标</span>
              <span className="sd-section-tag-placeholder" />
            </div>
            <div className="sd-goals-list">
              {data.goals.length > 0 ? data.goals.map((goal, index) => (
                <div key={`${goal}-${index}`} className="sd-goal-item">
                  <img src={iconGoalCheck} alt="目标" width={20} height={20} />
                  <div className="sd-goal-text">{goal}</div>
                </div>
              )) : (
                <div className="sd-goal-text">暂无工作目标</div>
              )}
            </div>
          </div>
        </div>

        {(data.scopeDesc || data.scopeTags.length > 0) && (
          <div className="sd-card">
            <div className="sd-card-content">
              <div className="sd-section-header">
                <span className="sd-dot sd-dot--warning" />
                <span className="sd-section-title">工作范围</span>
                <span className="sd-section-tag-placeholder" />
              </div>
              <p className="sd-scope-desc">{data.scopeDesc}</p>
              <div className="sd-tags-container">
                <div className="sd-tags-row">
                  {data.scopeTags.map((tag, index) => (
                    <span key={`${tag}-${index}`} className="sd-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
