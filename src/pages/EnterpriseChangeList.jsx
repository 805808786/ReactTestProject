import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import FilterSheet from './components/FilterSheet';
import InfiniteList from './components/InfiniteList';
import DateSelection from './components/dataSelection/index';
import { queryEnterpriseChangeList } from '../api/enterpriseChange';
import iconSearchInput from '../assets/icon-search-input.svg';
import iconCaretDown from '../assets/icon-caret-down-small.svg';
import iconBuilding from '../assets/icon-company-se.svg';
import './EnterpriseChangeList.css';


const PAGE_SIZE = 10;

const DYNAMIC_TYPE_OPTIONS = {
  '规则性调整': -1,
  '拱墅区区内新设企业': 2,
  '拱墅区区外新迁入企业': 3,
  '拱墅区区内企业注销或吊销': 4,
  '拱墅区区内企业迁出': 7,
  '在册企业转为在地': 8,
  '在地企业转为在册': 9,
};

const TYPE_CODE_TO_LABEL = Object.fromEntries(
  Object.entries(DYNAMIC_TYPE_OPTIONS).map(([label, code]) => [code, label]),
);

const NEGATIVE_TYPE_CODES = [4, 7];
const POSITIVE_STATUS_KEYWORDS = ['存续'];

function getDefaultPickerDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateDisplay(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日`;
}

function normalizeStatusTone(statusText) {
  const status = String(statusText || '').trim();
  return POSITIVE_STATUS_KEYWORDS.some((keyword) => status.includes(keyword)) ? 'success' : 'danger';
}

function normalizeType(item, selectedTypeCode) {
  const finalTypeCode = item?.type || 0;
  const finalTypeLabel = TYPE_CODE_TO_LABEL[finalTypeCode] || '';

  return {
    type: finalTypeLabel,
    typeTone: [2, 3].includes(finalTypeCode) ? 'green' : [4, 7].includes(finalTypeCode) ? 'red' : [8, 9].includes(finalTypeCode) ? 'blue' : ''
  };
}

function toCardItem(item, index, selectedTypeCode) {
  const allTags = Array.isArray(item?.tags)
    ? item.tags
      .map((tag) => String(tag || '').trim())
      .filter(Boolean)
    : [];
  const { type, typeTone } = normalizeType(item, selectedTypeCode);
  const status = String(item?.businessStatus || '').trim() || '--';


  return {
    id: item?.enterpriseId,
    type,
    typeTone,
    name: item?.enterpriseName || '--',
    tags: allTags.slice(0, 2),
    tagMore: Math.max(0, allTags.length - 2),
    creditCode: item?.unifiedCreditCode || '--',
    status,
    statusTone: normalizeStatusTone(status),
    sourceLabel: '数据来源',
    sourceValue: item?.dataSource || '--',
    enterpriseLogo: item?.enterpriseLogo || '',
    enterpriseLogoSmall: item?.enterpriseLogoSmall || '',
    enterpriseLogoDefault: item?.enterpriseLogoDefault || '',
  };
}

function FilterButton({ label, active, count, onClick }) {
  return (
    <button className={`ecl-filter-btn${active ? ' ecl-filter-btn--active' : ''}`} onClick={onClick}>
      <span className="ecl-filter-btn-text">{label}{count > 0 ? `(${count})` : ''}</span>
      <img
        src={iconCaretDown}
        alt="展开"
        className={`ecl-filter-caret${active ? ' ecl-filter-caret--active' : ''}`}
        width={16}
        height={16}
      />
    </button>
  );
}

function ChangeCard({ item, highlighted = false, onDetail }) {
  return (
    <article className={`ecl-card ${highlighted ? 'ecl-card--highlight' : ''}`}>
      <div className={`ecl-card-type ecl-card-type--${item.typeTone}`}>{item.type}</div>

      <div className="ecl-card-top">
        <div className="ecl-card-title-wrap">
          <img className="ecl-card-icon-box" src={(item.enterpriseLogo ? import.meta.env.VITE_BASE_URL + item.enterpriseLogo : item.enterpriseLogoSmall ? import.meta.env.VITE_BASE_URL + item.enterpriseLogoSmall : item.enterpriseLogoDefault ? import.meta.env.VITE_BASE_URL + item.enterpriseLogoDefault : iconBuilding)} alt="" />
          <div className="ecl-card-main">
            <h3 className="ecl-card-title">{item.name}</h3>
            <div className="ecl-card-tags">
              {item.tags.map((tag, tagIndex) => (
                <span className="ecl-tag" key={`${item.id}-${tag}-${tagIndex}`}>{tag}</span>
              ))}
              {item.tagMore > 0 && <span className="ecl-tag ecl-tag--more">+{item.tagMore}</span>}
            </div>
          </div>
        </div>
        <button type="button" className="ecl-card-detail-btn" onClick={onDetail}>查看详情 →</button>
      </div>

      <div className="ecl-card-info">
        <p className="ecl-card-info-row">
          <span className="ecl-label">统一社会信用代码：</span>
          <span className="ecl-value">{item.creditCode}</span>
        </p>
        <p className="ecl-card-info-row">
          <span className="ecl-label">经营状态：</span>
          <span className={`ecl-status ecl-status--${item.statusTone}`}>{item.status}</span>
        </p>
        <p className="ecl-card-info-row">
          <span className="ecl-label">{item.sourceLabel}：</span>
          <span className="ecl-value">{item.sourceValue}</span>
        </p>
      </div>
    </article>
  );
}

export default function EnterpriseChangeList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [pendingDate, setPendingDate] = useState(location.state?.date || null);
  const [confirmedDate, setConfirmedDate] = useState(location.state?.date || null);
  const [listData, setListData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const latestFetchKeyRef = useRef('');

  const selectedTypeCode = useMemo(() => {
    const firstType = typeFilter[0];
    return firstType ? DYNAMIC_TYPE_OPTIONS[firstType] : undefined;
  }, [typeFilter]);

  const selectedTypeLabel = useMemo(() => (
    typeFilter.length > 0 ? typeFilter.join('、') : '类型'
  ), [typeFilter]);

  const selectedTimeLabel = useMemo(() => (
    confirmedDate ? formatDateDisplay(confirmedDate) : '时间'
  ), [confirmedDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchText.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchPage = useCallback(async (page = 1, append = false) => {
    const fetchKey = JSON.stringify({
      date: confirmedDate || getDefaultPickerDate(),
      keyword: debouncedKeyword || '',
      type: selectedTypeCode || '',
    });
    latestFetchKeyRef.current = fetchKey;

    if (append) {
      setLoadingMore(true);
    } else {
      setListData([]);
      setTotal(0);
      setHasMore(false);
      setInitialLoading(true);
      setErrorMsg('');
    }

    try {
      const params = {
        currentPage: page,
        pageSize: PAGE_SIZE,
        date: confirmedDate || getDefaultPickerDate(),
        keyword: debouncedKeyword || undefined,
        type: selectedTypeCode,
      };
      const requestParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
      );
      const result = await queryEnterpriseChangeList(requestParams);
      if (latestFetchKeyRef.current !== fetchKey) return;

      const rows = Array.isArray(result?.data) ? result.data : [];
      const mappedRows = rows.map((item, index) => toCardItem(item, index + (page - 1) * PAGE_SIZE, selectedTypeCode));
      const totalCount = Number(result?.total);
      const pageTotal = Number(result?.pageTotal);

      setListData((prev) => {
        if (!append) return mappedRows;
        return [...prev, ...mappedRows];
      });
      setTotal((prev) => {
        if (Number.isFinite(totalCount)) return totalCount;
        return append ? prev + mappedRows.length : mappedRows.length;
      });
      setCurrentPage(page);

      if (Number.isFinite(pageTotal) && pageTotal > 0) {
        setHasMore(page < pageTotal);
      } else if (Number.isFinite(totalCount) && totalCount >= 0) {
        setHasMore(page * PAGE_SIZE < totalCount);
      } else {
        setHasMore(rows.length >= PAGE_SIZE);
      }
    } catch (error) {
      if (latestFetchKeyRef.current !== fetchKey) return;
      if (!append) {
        setListData([]);
        setTotal(0);
        setErrorMsg(error?.message || '列表加载失败');
      } else {
        setErrorMsg('');
      }
      setHasMore(false);
    } finally {
      if (latestFetchKeyRef.current !== fetchKey) return;
      if (append) {
        setLoadingMore(false);
      } else {
        setInitialLoading(false);
      }
    }
  }, [confirmedDate, debouncedKeyword, selectedTypeCode]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(false);
    fetchPage(1, false);
  }, [fetchPage]);

  const handleLoadMore = useCallback(async () => {
    if (initialLoading || loadingMore || !hasMore || errorMsg) return;
    await fetchPage(currentPage + 1, true);
  }, [initialLoading, loadingMore, hasMore, errorMsg, fetchPage, currentPage]);

  const handleTypeToggle = () => {
    setActiveFilter((prev) => (prev === 'type' ? null : 'type'));
  };

  const handleTimeToggle = () => {
    if (activeFilter === 'time') {
      setPendingDate(confirmedDate);
      setActiveFilter(null);
      return;
    }
    setPendingDate(confirmedDate || getDefaultPickerDate());
    setActiveFilter('time');
  };

  const handleTimeCancel = () => {
    setPendingDate(confirmedDate);
    setActiveFilter(null);
  };

  const handleTimeConfirm = () => {
    setConfirmedDate(pendingDate);
    setActiveFilter(null);
  };

  return (
    <div className="ecl-page">
      <PageHeader title="变化详情">
        <div className="ecl-search-row">
          <div className="ecl-search-bar">
            <img src={iconSearchInput} alt="搜索" className="ecl-search-icon" />
            <input
              className="ecl-search-input"
              placeholder="搜索企业名称/统一社会信用代码"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>

      <main className="ecl-body">
        <div className="ecl-filter-area">
          <div className="ecl-filter-row">
            <FilterButton
              label={selectedTypeLabel}
              active={activeFilter === 'type' || typeFilter.length > 0}
              onClick={handleTypeToggle}
            />
            <FilterButton
              label={selectedTimeLabel}
              active={activeFilter === 'time' || Boolean(confirmedDate)}
              onClick={handleTimeToggle}
            />
          </div>
        </div>

        <p className="ecl-count-text">筛选企业：{total}家</p>

        <section className="ecl-list">
          {!initialLoading && errorMsg ? (
            <div className="ecl-empty">{errorMsg}</div>
          ) : (
            <InfiniteList
              items={listData}
              renderItem={(item, index) => (
                <ChangeCard
                  item={item}
                  highlighted={index === 0 && item.typeTone === 'danger'}
                  onDetail={() => navigate(`/company-detail/${item.id}`)}
                />
              )}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loading={initialLoading || loadingMore}
              endText="已显示全部企业"
              emptyText="暂无匹配企业"
            />
          )}
        </section>
      </main>

      <FilterSheet
        title="类型"
        options={Object.keys(DYNAMIC_TYPE_OPTIONS)}
        value={typeFilter}
        onChange={setTypeFilter}
        onClose={() => setActiveFilter(null)}
        open={activeFilter === 'type'}
      />

      {activeFilter === 'time' && (
        <div className="ecl-sheet-overlay" onClick={handleTimeCancel}>
          <div className="ecl-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ecl-sheet-handle" />
            <DateSelection
              dateDisabledType="afterTodayAndToday"
              onSelect={setPendingDate}
              defaultValue={pendingDate || getDefaultPickerDate()}
            />
            {pendingDate && (
              <div className="ecl-sheet-info">
                <div className="ecl-sheet-info-date">{formatDateDisplay(pendingDate)}</div>
              </div>
            )}
            <div className="ecl-sheet-footer">
              <button className="ecl-sheet-btn ecl-sheet-btn--cancel" onClick={handleTimeCancel}>取消</button>
              <button className="ecl-sheet-btn ecl-sheet-btn--confirm" onClick={handleTimeConfirm}>确认</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
