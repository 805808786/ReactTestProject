import { useNavigate } from 'react-router-dom';
import iconBackWhite from '../assets/icon-back-white.svg';
import './PageHeader.css';

/**
 * PageHeader - 页面通用头部组件
 * 
 * 蓝色渐变背景 + 城市天际线底图 + 返回按钮 + 标题
 * 可通过 children 传入额外内容（搜索栏、统计卡片等）
 * 
 * Props:
 *   title       - 标题文字（必填）
 *   onBack      - 自定义返回回调（可选，默认 navigate(-1)）
 *   showBack    - 是否显示返回按钮（默认 true）
 *   children    - 头部下方的额外内容
 *   className   - 自定义类名
 */
export default function PageHeader({
  title,
  onBack,
  showBack = true,
  children,
  className = ''
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`page-header ${className}`}>
      <div className="page-header__top">
        {showBack && (
          <button className="page-header__back" onClick={handleBack} aria-label="返回">
            <img src={iconBackWhite} alt="返回" width={36} height={32} />
          </button>
        )}
        <span className="page-header__title">{title}</span>
      </div>
      {children && (
        <div className="page-header__content">
          {children}
        </div>
      )}
    </div>
  );
}
