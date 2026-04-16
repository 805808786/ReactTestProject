import { useState, useCallback, useRef, useEffect } from "react";
import FilterSheet from "./components/FilterSheet";
import InfiniteList from "./components/InfiniteList";
import iconVisitSearch from "../assets/icon-visit-search.svg";
import iconCaretDown from "../assets/icon-caret-down-small.svg";
import iconEdLink from "../assets/icon-ed-link.svg";
import "./EnterpriseDynamic.css";
import PageHeader from "../components/PageHeader";
import { getEnterpriseNewsList } from "../api/enterprise";

const DATE_RANGES = ["今日", "近一周", "近一月", "近三月", "近半年"];
const TIME_TYPE_MAP = {
  今日: 1,
  近一周: 2,
  近一月: 3,
  近三月: 4,
  近半年: 5,
};
const PAGE_SIZE = 10;

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const match = String(dateStr).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!match) return String(dateStr);
  return `${match[1]}年${Number(match[2])}月${Number(match[3])}号`;
}

function getMonthLabel(dateStr) {
  if (!dateStr) return "";
  const match = String(dateStr).match(/^(\d{4})-(\d{1,2})/);
  if (!match) return "";
  return `${match[1]}年${Number(match[2])}月`;
}

function buildSources(newsList = []) {
  return newsList
    .filter((item) => item?.articleUrl || item?.newsSource)
    .map((item, index) => ({
      id: `${item.newsSource || "source"}-${index}`,
      name: item.newsSource || "查看来源",
      url: item.articleUrl || "",
    }));
}

function mapVisitItem(item, index) {
  return {
    id: `${item.enterpriseName || "enterprise"}-${item.date || "date"}-${index}`,
    rawDate: item.date || "",
    month: getMonthLabel(item.date),
    date: formatDateLabel(item.date),
    title: item.enterpriseName || "",
    visitor: (item.personList || []).filter(Boolean).join("、"),
    sources: buildSources(item.newsList),
  };
}

function groupAndFlatten(visits) {
  const monthOrder = [];
  const monthMap = {};

  visits.forEach((visit) => {
    if (!monthMap[visit.month]) {
      monthMap[visit.month] = [];
      monthOrder.push(visit.month);
    }
    monthMap[visit.month].push(visit);
  });

  const flat = [];
  monthOrder.forEach((month, monthIndex) => {
    flat.push({
      id: `header-${month}`,
      itemType: "header",
      month,
      isFirstMonth: monthIndex === 0,
    });
    monthMap[month].forEach((visit) => flat.push({ ...visit, itemType: "card" }));
  });

  return flat;
}

function buildDisplayItems(allItems, page) {
  return groupAndFlatten(allItems).slice(0, page * PAGE_SIZE);
}

function FilterButton({ label, selected, active, onClick }) {
  return (
    <button
      className={`ed-filter-btn${active ? " ed-filter-btn--active" : ""}`}
      onClick={onClick}
    >
      <span className="ed-filter-btn-text">{selected || label}</span>
      <img
        src={iconCaretDown}
        alt="展开"
        className={`ed-filter-caret${active ? " ed-filter-caret--active" : ""}`}
        width={16}
        height={16}
      />
    </button>
  );
}

function MonthHeader({ month, isFirstMonth }) {
  return (
    <div
      className={`ed-month-header${isFirstMonth ? "" : " ed-month-header--spaced"}`}
    >
      {month}
    </div>
  );
}

function VisitCard({ item }) {
  const { date, title, visitor, sources = [] } = item;

  return (
    <div className="ed-card">
      <div className="ed-card-date">{date}</div>
      <div className="ed-card-main">
        <div className="ed-card-timeline-line" />
        <div className="ed-card-info">
          <div className="ed-card-title">{title}</div>
          <div className="ed-card-visitor">
            走访领导：{visitor || "暂无数据"}
          </div>
          <div className="ed-card-tags">
            {sources.map((source) => (
              <a
                key={source.id}
                href={source.url || undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="ed-card-tag">
                  <img src={iconEdLink} alt="" width={16} height={16} />
                  <span>{source.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnterpriseDynamic() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef(null);

  const [dateFilter, setDateFilter] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const dateFilterLabel = dateFilter.length > 0 ? dateFilter[0] : "走访日期";

  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const syncDisplayedItems = useCallback((nextItems, nextPage = 1) => {
    const flatItems = groupAndFlatten(nextItems);
    setDisplayedItems(flatItems.slice(0, nextPage * PAGE_SIZE));
    setHasMore(flatItems.length > nextPage * PAGE_SIZE);
    setPage(nextPage);
  }, []);

  const fetchVisits = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await getEnterpriseNewsList({
          keywords: debouncedSearch || undefined,
          timeType: TIME_TYPE_MAP[dateFilter[0]] || undefined,
        });
        const list = Array.isArray(response.data) ? response.data : [];
        const mappedItems = list
          .map(mapVisitItem)
          .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

        setAllItems(mappedItems);
        syncDisplayedItems(mappedItems, 1);
      } catch (error) {
        console.error("走访动态加载失败:", error);
        setAllItems([]);
        syncDisplayedItems([], 1);
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [debouncedSearch, dateFilter, syncDisplayedItems],
  );

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchText]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const handleLoadMore = useCallback(async () => {
    if (loading || refreshing || !hasMore) return;
    const nextPage = page + 1;
    setLoading(true);
    setDisplayedItems(buildDisplayItems(allItems, nextPage));
    setHasMore(groupAndFlatten(allItems).length > nextPage * PAGE_SIZE);
    setPage(nextPage);
    setLoading(false);
  }, [allItems, hasMore, loading, page, refreshing]);

  const handleRefresh = useCallback(async () => {
    await fetchVisits({ isRefresh: true });
  }, [fetchVisits]);

  const handleFilterToggle = (key) => {
    setActiveFilter((prev) => (prev === key ? null : key));
  };

  const renderItem = (item) => {
    if (item.itemType === "header") {
      return (
        <MonthHeader month={item.month} isFirstMonth={item.isFirstMonth} />
      );
    }
    return <VisitCard item={item} />;
  };

  return (
    <div className="ed-container">
      <PageHeader title="走访动态">
        <div className="ed-search-row">
          <div className="ed-search-bar">
            <img src={iconVisitSearch} alt="搜索" className="ed-search-icon" />
            <input
              className="ed-search-input"
              placeholder="搜索走访动态"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>

      <div className="ed-body">
        <div className="ed-filter-area">
          <div className="ed-filter-row">
            <FilterButton
              label="走访日期"
              active={activeFilter === "date" || dateFilter.length > 0}
              selected={dateFilterLabel}
              onClick={() => handleFilterToggle("date")}
            />
          </div>
        </div>

        <InfiniteList
          key="dynamic-list"
          items={displayedItems}
          renderItem={renderItem}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          hasMore={hasMore}
          loading={loading}
          refreshing={refreshing}
          emptyText="暂无走访动态"
          endText="已显示全部走访动态"
        />
      </div>

      <FilterSheet
        title="走访日期"
        options={DATE_RANGES}
        value={dateFilter}
        onChange={setDateFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === "date"}
      />
    </div>
  );
}
