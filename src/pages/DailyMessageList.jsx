import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ChatInfoCard from "../components/ChatInfoCard";
import InfiniteList from "./components/InfiniteList";
import FilterSheet from "./components/FilterSheet";
import DateSelection from "./components/dataSelection/index";
import { getDailyMessageList } from "../api/dailyMessage";
import "./SceneEnterprise.css";
import "./DailyMessageList.css";

/* ===================== 常量 ===================== */
const MESSAGE_TYPES = ["每日推荐", "新闻动态", "与我相关", "精准服务"];
const TYPE_VALUE_MAP = { 每日推荐: 1, 新闻动态: 2, 与我相关: 3, 精准服务: 4 };
const CARD_TYPE_CATEGORY_MAP = {
  1: "recommend",
  2: "news",
  3: "related",
  4: "service",
  recommend: "recommend",
  news: "news",
  related: "related",
  service: "service",
};
const CARD_TYPE_TAG_MAP = {
  1: "每日推荐",
  2: "新闻动态",
  3: "与我相关",
  4: "精准服务",
  recommend: "每日推荐",
  news: "新闻动态",
  related: "与我相关",
  service: "精准服务",
};
const CARD_TYPE_DOT_COLOR_MAP = {
  1: "#F59E0B",
  2: "#10BA51",
  3: "#3B82F6",
  4: "#E37318",
  recommend: "#F59E0B",
  news: "#10BA51",
  related: "#3B82F6",
  service: "#E37318",
};

/* ===================== 工具函数 ===================== */
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateDisplay(str) {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

function formatDateToDay(str) {
  if (!str) return "";
  const match = String(str).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  }
  return str;
}

function richTextToPlainText(content) {
  if (!content) return "";
  if (typeof window === "undefined") {
    return String(content)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const div = document.createElement("div");
  div.innerHTML = content;
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
}

function mapApiItemToCard(item) {
  const cardType = item.cardType;
  const category = CARD_TYPE_CATEGORY_MAP[cardType] || "news";
  const description = richTextToPlainText(
    item.content || item.richTextContent || item.serviceBackground || "",
  );

  return {
    id: item.id,
    category,
    tagText: CARD_TYPE_TAG_MAP[cardType] || "新闻动态",
    hasNotification: !item.isRead,
    dotColor: CARD_TYPE_DOT_COLOR_MAP[cardType] || null,
    title: item.title,
    description,
    timeAgo: formatDateToDay(item.publishTime || ""),
    detailUrl: `/daily-message-detail/${item.id}`,
  };
}

/* ===================== 筛选标签按钮 ===================== */
function FilterButton({ label, active, count, onClick }) {
  return (
    <button
      className={`se-filter-btn${active ? " se-filter-btn--active" : ""}`}
      onClick={onClick}
    >
      <span>
        {label}
        {count > 0 ? `(${count})` : ""}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M16.5 9H7.5L12 15.75L16.5 9Z" fill="black" fillOpacity="0.9" />
      </svg>
    </button>
  );
}

export default function DailyMessageList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentDate = searchParams.get("date");

  // 筛选状态
  const [typeFilter, setTypeFilter] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

  // 日历弹框
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState(currentDate);
  const [confirmedDate, setConfirmedDate] = useState(currentDate);

  // 列表数据
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const contentRef = useRef(null);

  // 使用ref存储最新的筛选条件
  const filtersRef = useRef({ typeFilter, confirmedDate });
  useEffect(() => {
    filtersRef.current = { typeFilter, confirmedDate };
  }, [typeFilter, confirmedDate]);

  // 获取列表数据
  const fetchMessages = useCallback(async (page = 1, isRefresh = false) => {
    const {
      typeFilter: currentTypeFilter,
      confirmedDate: currentConfirmedDate,
    } = filtersRef.current;
    const cardType =
      currentTypeFilter.length > 0
        ? TYPE_VALUE_MAP[currentTypeFilter[0]]
        : undefined;

    try {
      const response = await getDailyMessageList({
        currentPage: page,
        pageSize: 10,
        cardType,
        startTime: currentConfirmedDate || undefined,
        endTime: currentConfirmedDate || undefined,
      });

      const pageData = response.data || {};
      const items = pageData.data || [];
      const total = pageData.total || 0;

      const mappedData = items.map(mapApiItemToCard);

      setDisplayedItems((prev) => {
        const updated = isRefresh ? mappedData : [...prev, ...mappedData];
        setHasMore(updated.length < total);
        return updated;
      });
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching daily messages:", error);
    }
  }, []);

  // 统一处理筛选条件变化
  useEffect(() => {
    setCurrentPage(1);
    setLoading(true);
    setDisplayedItems([]);
    setHasMore(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      const ilContainer = contentRef.current.querySelector(".il-container");
      if (ilContainer) {
        ilContainer.scrollTop = 0;
      }
    }
    fetchMessages(1, true).finally(() => {
      setLoading(false);
    });
  }, [typeFilter, confirmedDate, fetchMessages]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await fetchMessages(currentPage + 1);
    setLoading(false);
  }, [loading, hasMore, currentPage, fetchMessages]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMessages(1, true);
    setRefreshing(false);
  }, [fetchMessages]);

  const handleCalendarOpen = useCallback(() => {
    setPendingDate(confirmedDate);
    setCalendarOpen(true);
  }, [confirmedDate]);

  const handleCalendarClose = useCallback(() => setCalendarOpen(false), []);

  const handleCalendarReset = useCallback(() => {
    setPendingDate(null);
  }, []);

  const handleCalendarConfirm = useCallback(() => {
    setConfirmedDate(pendingDate);
    setCalendarOpen(false);
    setTypeFilter([]);
    setActiveFilter(null);
  }, [pendingDate]);

  return (
    <div className="daily-msg-page">
      <PageHeader title="今日消息" showBack={true} />

      <div className="daily-msg-body" ref={contentRef}>
        {/* 筛选区域 */}
        <div className="se-dynamic-filter-area pb-16">
          <div className="se-filter-row">
            <FilterButton
              label="类型"
              active={activeFilter === "type" || typeFilter.length > 0}
              count={typeFilter.length}
              onClick={() =>
                setActiveFilter(activeFilter === "type" ? null : "type")
              }
            />
            <FilterButton
              label={confirmedDate ? formatDateDisplay(confirmedDate) : "时间"}
              active={activeFilter === "date" || !!confirmedDate}
              count={0}
              onClick={handleCalendarOpen}
            />
          </div>
        </div>

        {/* 列表 */}
        <InfiniteList
          items={displayedItems}
          renderItem={(item) => (
            <ChatInfoCard card={item} onNavigate={(url) => navigate(url)} />
          )}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          hasMore={hasMore}
          loading={loading}
          refreshing={refreshing}
          endText="已显示全部消息"
        />
      </div>

      {/* 类型筛选底部弹框 */}
      <FilterSheet
        title="类型"
        options={MESSAGE_TYPES}
        value={typeFilter}
        onChange={setTypeFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === "type"}
        multiple={false}
      />

      {/* 日历底部弹框 */}
      {calendarOpen && (
        <div className="dm-cal-overlay" onClick={handleCalendarClose}>
          <div className="dm-cal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="dm-cal-handle" />
            <div className="dm-cal-header">
              <span className="dm-cal-title">时间</span>
              <button
                className="dm-cal-reset-btn"
                onClick={handleCalendarReset}
              >
                重置
              </button>
            </div>
            <DateSelection
              dateDisabledType="afterToday"
              onSelect={(date) => setPendingDate(date)}
              defaultValue={pendingDate}
            />
            <div className="dm-cal-footer">
              <button
                className="dm-cal-btn dm-cal-btn--cancel"
                onClick={handleCalendarClose}
              >
                取消
              </button>
              <button
                className="dm-cal-btn dm-cal-btn--confirm"
                onClick={handleCalendarConfirm}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
