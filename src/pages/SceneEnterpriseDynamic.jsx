import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FilterSheet from "./components/FilterSheet";
import InfiniteList from "./components/InfiniteList";
import iconSearchDynamic from "../assets/icon-search-dynamic.svg";
import iconNewspaper from "../assets/icon-newspaper.svg";
import iconCaretDown from "../assets/icon-caret-down-small.svg";
import "./SceneEnterpriseDynamic.css";
import PageHeader from "../components/PageHeader";
import {
  getNewsInsightPage,
  getNewsSourceList,
  getNewsTypeList,
} from "../api/sceneEnterpriseDynamic";

const DEFAULT_TYPES = [
  "融资动态",
  "行业动态",
  "合作动态",
  "企业荣誉",
  "政策解读",
];
const DEFAULT_SOURCES = [
  "人民日报",
  "杭州日报",
  "杭州证券报",
  "拱墅发布",
  "杭州发布",
];
const TIME_RANGES = ["今日", "近一周", "近一月", "近三月", "近半年"];
const TIME_TYPE_MAP = {
  今日: 1,
  近一周: 2,
  近一月: 3,
  近三月: 4,
  近半年: 5,
};
const PAGE_SIZE = 8;

function FilterButton({ label, selected, active, onClick }) {
  return (
    <button
      className={`sed-filter-btn${active ? " sed-filter-btn--active" : ""}`}
      onClick={onClick}
    >
      <span className="sed-filter-btn-text">
        {selected || label}
      </span>
      <img
        src={iconCaretDown}
        alt="展开"
        className={`sed-filter-caret${active ? " sed-filter-caret--active" : ""}`}
        width={16}
        height={16}
      />
    </button>
  );
}

function DynamicCard({ item, onViewDetail }) {
  const {
    newsType,
    articleTitle,
    publishDate,
    contentSummary,
    newsSource,
    enterpriseList,
    isFirst,
  } = item;
  const relatedText = `关联 ${(enterpriseList || []).length} 家企业`;

  // 类型到样式类名的映射
  const getBadgeClass = (type) => {
    const typeMap = {
      调研走访: "sed-badge--news",
      政策法规: "sed-badge--recommend",
      为企服务: "sed-badge--service",
      数据要素: "sed-badge--related",
      科技创新: "sed-badge--tech",
      商务社区: "sed-badge--business",
      城市建设: "sed-badge--city",
      文旅宣传: "sed-badge--recommend",
    };
    return typeMap[type] || "sed-badge";
  };

  return (
    <div className={`sed-card${isFirst ? " sed-card--first" : ""}`}>
      <div className="sed-card-top">
        <div className="sed-badge">{newsType || ""}</div>
        <span
          className="sed-view-detail"
          onClick={() => onViewDetail && onViewDetail(item)}
        >
          查看详情 →
        </span>
      </div>

      <div className="sed-title-row">
        <div className="sed-title-left">
          <div className="sed-green-dot" />
          <span className="sed-title">{articleTitle || ""}</span>
        </div>
        <span className="sed-date">{publishDate || ""}</span>
      </div>

      <div className="sed-content">{contentSummary || ""}</div>

      <div className="sed-card-footer">
        <div className="sed-source">
          {!!newsSource && (
            <>
              <img
                src={iconNewspaper}
                alt="来源"
                className="sed-newspaper-icon"
                width={12}
                height={12}
              />
              <span className="sed-source-name">{newsSource || ""}</span>
            </>
          )}
        </div>
        <span className="sed-related">{relatedText}</span>
      </div>
    </div>
  );
}

export default function SceneEnterpriseDynamic() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sceneName = searchParams.get("sceneName")?.trim() || "";

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef(null);

  const [typeFilter, setTypeFilter] = useState([]);
  const [sourceFilter, setSourceFilter] = useState([]);
  const [timeFilter, setTimeFilter] = useState([]);
  const [typeOptions, setTypeOptions] = useState(DEFAULT_TYPES);
  const [sourceOptions, setSourceOptions] = useState(DEFAULT_SOURCES);
  const [activeFilter, setActiveFilter] = useState(null);
  const typeFilterLabel = typeFilter[0] || "类型";
  const sourceFilterLabel = sourceFilter[0] || "来源";
  const timeFilterLabel = timeFilter[0] || "时间";

  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtersRef = useRef({
    debouncedSearch: "",
    typeFilter: [],
    sourceFilter: [],
    timeFilter: [],
  });

  useEffect(() => {
    filtersRef.current = {
      debouncedSearch,
      typeFilter,
      sourceFilter,
      timeFilter,
    };
  }, [debouncedSearch, typeFilter, sourceFilter, timeFilter]);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchText]);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([getNewsTypeList(), getNewsSourceList()])
      .then(([typeRes, sourceRes]) => {
        if (cancelled) return;

        if (typeRes.status === "fulfilled") {
          const nextTypes = Array.isArray(typeRes.value?.data)
            ? typeRes.value.data.filter(Boolean)
            : [];
          if (nextTypes.length > 0) {
            setTypeOptions(nextTypes);
          }
        } else {
          console.error("类型列表加载失败:", typeRes.reason);
        }

        if (sourceRes.status === "fulfilled") {
          const nextSources = Array.isArray(sourceRes.value?.data)
            ? sourceRes.value.data.filter(Boolean)
            : [];
          if (nextSources.length > 0) {
            setSourceOptions(nextSources);
          }
        } else {
          console.error("来源列表加载失败:", sourceRes.reason);
        }
      })
      .catch((error) => {
        console.error("筛选项加载失败:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchDynamicList = useCallback(
    async (page = 1, isRefresh = false) => {
      const {
        debouncedSearch: keyword,
        typeFilter: currentTypeFilter,
        sourceFilter: currentSourceFilter,
        timeFilter: currentTimeFilter,
      } = filtersRef.current;

      try {
        const response = await getNewsInsightPage({
          status: "1",
          currentPage: page,
          pageSize: PAGE_SIZE,
          keyword: keyword || undefined,
          newsType: currentTypeFilter[0] || undefined,
          newsSource: currentSourceFilter[0] || undefined,
          timeType: currentTimeFilter[0]
            ? TIME_TYPE_MAP[currentTimeFilter[0]]
            : undefined,
          sceneGroupName: sceneName || undefined,
        });

        const pageData = response.data || {};
        const items = Array.isArray(pageData.data) ? pageData.data : [];
        const total = Number(pageData.total || 0);

        setDisplayedItems((prev) => {
          const merged = isRefresh ? items : [...prev, ...items];
          const nextItems = merged.map((item, index) => ({
            ...item,
            enterpriseList: Array.isArray(item.enterpriseList)
              ? item.enterpriseList
              : [],
            isFirst: index === 0,
          }));
          setHasMore(nextItems.length < total);
          return nextItems;
        });
        setCurrentPage(page);
      } catch (error) {
        console.error("新闻动态列表加载失败:", error);
        if (isRefresh || page === 1) {
          setDisplayedItems([]);
          setHasMore(false);
        }
      }
    },
    [sceneName],
  );

  const reloadDynamicList = useCallback(async () => {
    setCurrentPage(1);
    setLoading(true);
    setDisplayedItems([]);
    setHasMore(false);

    try {
      await fetchDynamicList(1, true);
    } finally {
      setLoading(false);
    }
  }, [fetchDynamicList]);

  useEffect(() => {
    reloadDynamicList();
  }, [
    debouncedSearch,
    typeFilter,
    sourceFilter,
    timeFilter,
    reloadDynamicList,
  ]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await fetchDynamicList(currentPage + 1);
    setLoading(false);
  }, [loading, hasMore, currentPage, fetchDynamicList]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDynamicList(1, true);
    setRefreshing(false);
  }, [fetchDynamicList]);

  const handleFilterToggle = (key) => {
    setActiveFilter((prev) => (prev === key ? null : key));
  };

  const handleViewDetail = useCallback(
    (item) => {
      navigate(`/scene-enterprise-dynamic-detail/${item.id}`);
    },
    [navigate],
  );

  return (
    <div className="sed-container">
      <PageHeader title={`${sceneName || "场景"}动态`}>
        <div className="sed-search-row">
          <div className="sed-search-bar">
            <img
              src={iconSearchDynamic}
              alt="搜索"
              className="sed-search-icon"
            />
            <input
              className="sed-search-input"
              placeholder="搜索资讯信息"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>

      <div className="sed-body">
        <div className="sed-filter-area">
          <div className="sed-filter-row">
            <FilterButton
              label="类型"
              active={activeFilter === "type" || typeFilter.length > 0}
              selected={typeFilterLabel}
              onClick={() => handleFilterToggle("type")}
            />
            <FilterButton
              label="来源"
              active={activeFilter === "source" || sourceFilter.length > 0}
              selected={sourceFilterLabel}
              onClick={() => handleFilterToggle("source")}
            />
            <FilterButton
              label="时间"
              active={activeFilter === "time" || timeFilter.length > 0}
              selected={timeFilterLabel}
              onClick={() => handleFilterToggle("time")}
            />
          </div>
        </div>

        <InfiniteList
          items={displayedItems}
          renderItem={(item) => (
            <DynamicCard item={item} onViewDetail={handleViewDetail} />
          )}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          hasMore={hasMore}
          loading={loading}
          refreshing={refreshing}
          endText="已显示全部动态"
        />
      </div>

      <FilterSheet
        title="类型"
        options={typeOptions}
        value={typeFilter}
        onChange={setTypeFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === "type"}
      />
      <FilterSheet
        title="来源"
        options={sourceOptions}
        value={sourceFilter}
        onChange={setSourceFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === "source"}
      />
      <FilterSheet
        title="时间"
        options={TIME_RANGES}
        value={timeFilter}
        onChange={setTimeFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === "time"}
      />
    </div>
  );
}
