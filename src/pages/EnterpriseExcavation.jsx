import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import iconCalendar from "../assets/icon-dynamic-calendar.svg";
import PageHeader from "../components/PageHeader";
import { getDailyMessageDetail } from "../api/dailyMessage";
import "./EnterpriseExcavation.css";

function formatDate(str) {
  if (!str) return "";
  const match = String(str).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  }
  return str;
}

export default function EnterpriseExcavation() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    getDailyMessageDetail({ id })
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => console.error("Error fetching enterprise excavation:", err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="ee-container">
      <PageHeader title="企业挖掘" />
      <div className="ee-body">
        {loading ? (
          <div className="ee-loading">
            <div className="ee-loading-spinner" />
            <span className="ee-loading-text">加载中...</span>
          </div>
        ) : data ? (
          <div className="ee-card">
            <div className="ee-card-content">
              <div className="ee-header-section">
                <h1 className="ee-title">{data.title}</h1>
                <div className="ee-date-row">
                  <img src={iconCalendar} alt="日期" width={12} height={12} />
                  <span className="ee-date-text">{formatDate(data.publishTime)}</span>
                </div>
              </div>

              <div className="ee-separator" />

              {data.remark && (
                <div className="ee-box">
                  <p className="ee-box-label ee-box-label--red">摘要</p>
                  <p className="ee-box-text">{data.remark}</p>
                </div>
              )}

              {data.content && (
                <div className="ee-box">
                  <p className="ee-box-label ee-box-label--black">挖掘说明</p>
                  <div
                    className="ee-box-content"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="ee-empty">暂无数据</div>
        )}
      </div>
    </div>
  );
}
