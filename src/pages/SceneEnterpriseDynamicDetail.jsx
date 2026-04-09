import { useNavigate, useParams, useLocation } from 'react-router-dom';
import iconBack from '../assets/icon-dynamic-back.svg';
import iconNewspaper from '../assets/icon-dynamic-newspaper.svg';
import iconCalendar from '../assets/icon-dynamic-calendar.svg';
import iconBuilding from '../assets/icon-dynamic-building.svg';
import iconLinkBlue from '../assets/icon-link-blue.svg';
import './SceneEnterpriseDynamicDetail.css';
import PageHeader from '../components/PageHeader';

/* ===================== Mock 详情数据 ===================== */
const MOCK_DETAIL_DATA = {
  1: {
    type: '融资动态',
    title: '杭州市创新科技有限公司完成首轮融资',
    date: '2026-04-01',
    source: '人民日报',
    summary: '摘要: 杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元,本轮融资将用于技术研发和市场拓展。',
    paragraphs: [
      '杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元。本轮融资由知名投资机构领投,多家产业资本跟投。据悉,本轮融资将主要用于人工智能技术的研发、产品迭代以及市场推广。',
      '公司创始人张伟表示:"非常感谢投资方的信任与支持。本轮融资将加速我们在人工智能领域的布局,我们将继续专注于为企业客户提供更优质的智能化解决方案。"',
      '业内专家认为,随着数字化转型的深入,企业对智能化服务的需求日益增长,杭州市创新科技有限公司在这一领域具有较强的竞争优势。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '杭州市创新科技有限公司',
        industry: '软件和信息技术服务业',
        legalPerson: '张伟',
        status: '存续',
      },
    ],
  },
  2: {
    type: '行业动态',
    title: '拱墅智能制造产业园正式启动，多家企业入驻',
    date: '2026-03-01',
    source: '杭州日报',
    summary: '摘要: 拱墅区科学城智能制造产业园正式启动，首批入驻企业包括广州智能制造股份有限公司等10家企业。',
    paragraphs: [
      '拱墅区科学城智能制造产业园正式启动，首批入驻企业包括广州智能制造股份有限公司等10家企业，总投资额超过5亿元，预计年产值可达20亿元。',
      '拱墅区委书记在启动仪式上表示，智能制造产业园的建设是拱墅区推进新型工业化、打造先进制造业高地的重要举措，将有力推动全区经济高质量发展。',
      '园区将聚焦智能装备、工业机器人、高端数控机床等领域，提供全周期、全链条的产业服务，打造国内一流的智能制造产业生态。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '广州智能制造股份有限公司',
        industry: '专用设备制造业',
        legalPerson: '李明',
        status: '存续',
      },
    ],
  },
  3: {
    type: '合作动态',
    title: '拱墅云端数据服务有限公司与多家银行达成战略合作',
    date: '2026-02-28',
    source: '杭州证券报',
    summary: '摘要: 拱墅云端数据服务有限公司近日与工商银行、建设银行等多家金融机构签署战略合作协议，共同推进金融科技创新。',
    paragraphs: [
      '拱墅云端数据服务有限公司近日与工商银行、建设银行等多家金融机构签署战略合作协议，双方将在数字金融、数据服务、科技赋能等领域开展深度合作。',
      '根据协议，拱墅云端数据服务有限公司将为合作银行提供企业数据画像、风险预警、智能分析等数字化服务，助力金融机构提升服务能力和风控水平。',
      '业内人士表示，此次合作是金融科技与实体产业深度融合的典型案例，有助于降低企业融资门槛，推动区域金融生态健康发展。',
    ],
    relatedCompanies: [
      {
        id: 1,
        name: '拱墅云端数据服务有限公司',
        industry: '软件和信息技术服务业',
        legalPerson: '王芳',
        status: '存续',
      },
    ],
  },
  4: {
    type: '每日推荐',
    category: 'recommend',
    title: '杭州杭钢云计算数据中心有限公司',
    date: '2026-04-01',
    source: '',
    summary: '杭州杭钢云计算数据中心有限公司是杭钢集团数字经济转型骨干企业。其数据中心（东区）入选国家绿色数据中心，PUE值控制在1.30以下，走在全国前列，利用老厂房改造实现“从炼钢到炼数”的绿色升级。',
    subSummary: '项目与阿里合作，规划大规模算力设施，已投运数千机柜，支持政务云、信创云等应用，为长三角数字基础设施和AI发展提供坚实支撑，助力高质量发展。',
    paragraphs: [
      '杭州杭钢云计算数据中心有限公司是杭钢集团旗下国有企业，由金属制造转型为数字经济核心企业，主营第一类增值电信业务、大数据服务及软件开发等，注册资本75898万元。',
    ],
    relatedCompanies: [],
    link: '/company-detail/1848243523192745991'
  },
  5: {
    type: '新闻动态',
    category: 'news',
    title: '竣工！大城北再添“产业新引擎”',
    date: '2026-04-09',
    source: '拱墅发布',
    summary: '近日，杭州城投·未来500⁺一期首发项目成功取得《建设工程竣工验收备案表》，标志着该项目已全面具备投产运营条件，为杭州大城北再添一座高品质产业载体，为产业升级注入新动能，助力区域产业能级实现新提升。',
    sourceLink: { label: '拱墅发布', url: 'https://mp.weixin.qq.com/s/UKaPtNaoBlvdzwSK9QiMOw' },
    paragraphs: [],
    // relatedCompanies: [
    //   {
    //     id: 1,
    //     name: '杭州本导生物医药科技有限公司',
    //     detailUrl: '/company-detail/2039978194416812033'
    //     // industry: '软件和信息技术服务业',
    //     // legalPerson: '张伟',
    //     // status: '存续',
    //   },
    //   // {
    //   //   id: 2,
    //   //   name: '上海润达医疗',
    //   //   // industry: '软件和信息技术服务业',
    //   //   // legalPerson: '张伟',
    //   //   // status: '存续',
    //   // },
    // ],
  },
  6: {
    type: '与我相关',
    category: 'related',
    title: '区领导带队赴上海开展招商考察活动',
    date: '2026-04-01',
    source: '拱墅发布',
    summary: '3月31日至4月1日，区委副书记、区长陈宇带队赴上海开展招商考察活动。',
    sourceLink: { label: '拱墅发布', url: 'https://mp.weixin.qq.com/s/b0XVuLwoycSbCzNnWts1iA' },
    paragraphs: [],
    // relatedDepartments: [
    //   {
    //     id: 1,
    //     name: '拱墅区区委办',
    //     // street: '拱宸桥街道',
    //     // legalPerson: '王翔',
    //   },
    //   {
    //     id: 2,
    //     name: '拱墅区信访局',
    //     // street: '拱宸桥街道',
    //     // legalPerson: '王翔',
    //   },
    //   {
    //     id: 3,
    //     name: '拱墅区综合行政执法局',
    //     // street: '拱宸桥街道',
    //     // legalPerson: '王翔',
    //   },
    // ],
    relatedCompanies: [
      {
        id: 1,
        name: '上海润达医疗科技股份有限公司',
        // industry: '软件和信息技术服务业',
        // legalPerson: '张伟',
        // status: '存续',
      },
    ],
  },
  "1000": {
    "type": "调研走访",
    "title": "刘捷在杭州专题调研软件和信息服务业发展",
    "date": "2026-04-08",
    "source": "拱墅发布",
    "summary": "刘捷在杭州专题调研软件和信息服务业发展工作时强调：深化人工智能赋能，提升融合发展水平，加快推动服务业高质量发展",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s/kQ045B4Mif_p0Rfc0Vt71A"
    },
    "relatedCompanies": []
  },
  "1001": {
    "type": "调研走访",
    "title": "区领导带队赴上海开展招商考察活动",
    "date": "2026-04-02",
    "source": "拱墅发布",
    "summary": "区委副书记、区长陈宇带队赴上海进行招商考察活动，强调项目为王，推进产业结构调整和转型升级。走访了多家企业，就项目合作及产业发展进行了深入交流。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655959618&idx=1&sn=70ffe2c357990106505e06e128f65cc4"
    },
    "relatedCompanies": []
  },
  "1002": {
    "type": "政策法规",
    "title": "拱墅新一轮经济政策发布",
    "date": "2026-04-01",
    "source": "拱墅发布",
    "summary": "拱墅区为推动经济稳进提质和创新发展，对‘8+4’经济政策进行迭代更新。主要内容包括深化教育科技人才一体改革发展、加快先进制造业发展、推进服务业扩能提质和消费转型升级、建设国际性综合交通枢纽城市和交通强国示范城市、推进高水平对外开放、全力扩大有效投资、推进城乡一体融合高质量发展以及保障和改善民生等方面，共计43条政策条款，区级财政资金超68亿元。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655959593&idx=1&sn=f66cd911138dd2b61cccf94bb171a7b9"
    },
    "relatedCompanies": []
  },
  "1003": {
    "type": "为企服务",
    "title": "全省首个园区级“证电碳服务窗口”，如何打造零碳全国样板？",
    "date": "2026-04-01",
    "source": "拱墅发布",
    "summary": "全省首个园区级‘证电碳服务窗口’在大运河数智城智慧网谷小镇正式投用，国网拱墅区供电公司同步推出一系列优化举措，以一站式集成服务打通政企碳服务对接‘最后一公里’，助力园区打造零碳全国样板、助推区域绿色低碳转型。大运河数智城已形成数字经济为核心，人工智能等产业协同发展的格局，并创新构建了‘1+5+X’服务业主导型低碳园区体系。通过先进技术赋能，园区实现能源轻量化改造，推进光伏建设，提升绿色用能占比，打造充电服务生态圈。未来，大运河数智城将与拱墅电力深化合作，推动产业与电力服务深度融合。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655959522&idx=1&sn=acd8c63fdbfc984d903e73cc0d245a62"
    },
    "relatedCompanies": []
  },
  "1004": {
    "type": "数据要素",
    "title": "拱墅有“数”，“冠军”有路",
    "date": "2026-04-01",
    "source": "拱墅发布",
    "summary": "2025年，拱墅企业托普云农在国家“数据要素×”大赛中获全国一等奖，标志着浙江省在该奖项上实现零的突破。托普云农致力于智慧农业综合服务，深耕行业十余年，获得多项荣誉和专利。此次获奖与拱墅构建的数据生态密不可分，拱墅通过数据产业梯度培育机制和创新构建数商标签体系，推动企业快速发展。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655959536&idx=1&sn=f2840bfafb8687fe85d1592a20b6331d"
    },
    "relatedCompanies": [
      {
        "id": 1004,
        "name": "浙江托普云农科技股份有限公司",
        "detailUrl": "/company-detail/1848243286290067459"
      }
    ]
  },
  "1005": {
    "type": "调研走访",
    "title": "姚高员调研大城北地区产业高质量发展工作：以科技创新推动文化发展  更好把文化软实力转化为经济社会发展硬实力",
    "date": "2026-03-30",
    "source": "拱墅发布",
    "summary": "姚高员在调研大城北地区产业高质量发展工作时强调，要以科技创新推动文化发展，将文化软实力转化为经济社会发展硬实力。他参观了杭州全息智能技术研究院和浙报数字文化集团股份有限公司，鼓励开发更多‘文化+科技’融合的爆款产品，并强调了人工智能在文化产业中的重要作用。同时，他还关注了生物医药产业的发展，并提出要进一步强化企业创新主体地位。此外，他还强调市级相关部门和属地应优化创新生态，推动产业高质量发展。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655959489&idx=1&sn=e686cf0b902f27267cf73bbe61d07832"
    },
    "relatedCompanies": [
      {
        "id": 1005,
        "name": "浙报数字文化集团股份有限公司",
        "detailUrl": "/company-detail/1848243450094415875"
      }
    ]
  },
  "1006": {
    "type": "科技创新",
    "title": "让AI主动带货！这家企业帮中国品牌“被看见”",
    "date": "2026-03-28",
    "source": "拱墅发布",
    "summary": "一家中国供应商通过与万悉科技合作，挖掘出其无起订量发货的独特优势，通过AI推荐提升客户转化率。万悉科技利用GEO（原生GEO系统）帮助企业在全球营销领域脱颖而出，并强调诚信和真实的内容制作，助力企业实现高质量出海。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655959333&idx=1&sn=b91f69dfe9b9406e4b09d9b2b421366c"
    },
    "relatedCompanies": []
  },
  "1007": {
    "type": "商务社区",
    "title": "OPC社区火出圈，来拱墅开启创业新模式",
    "date": "2026-03-25",
    "source": "拱墅发布",
    "summary": "浙江广城商业管理有限公司总经理杨舒晓认为，人工智能成为新的风口，企业抓住机会可以弥补失去的。东新街道正在推进‘AI+OPC社区’布局，旨在降低创新创业成本，推动个体及企业运用AI技术。星火智造园作为老牌科创载体，已孵化出多家优质企业，正转型为人工智能OPC产业社区，助力区域经济高质量发展。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655958973&idx=1&sn=9e3d36cf0ed2e9721f31ef51b7f3739e"
    },
    "relatedCompanies": [
      {
        "id": 1007,
        "name": "杭州万悉科技有限公司",
        "detailUrl": "/company-detail/1848244183254560771"
      }
    ]
  },
  "1008": {
    "type": "城市建设",
    "title": "这片满载荣光的老厂房向新而生",
    "date": "2026-03-23",
    "source": "拱墅发布",
    "summary": "本文介绍了杭州叉车厂石桥科创园的转型升级过程，从传统的制造业基地转变为现代化的科技创新园区。文章讲述了该园区的发展历程、现状及未来规划，强调了其在智能制造和新能源领域的创新和发展潜力，以及对区域经济发展的贡献。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655958772&idx=1&sn=708b944b86ecc86c93f8dd06204502b8"
    },
    "relatedCompanies": []
  },
  "1009": {
    "type": "科技创新",
    "title": "工信部认定！拱墅的TA入选",
    "date": "2026-03-20",
    "source": "拱墅发布",
    "summary": "工业和信息化部发布科技型企业和孵化器名单，杭州集成电路创新产业园成功入选标准级孵化器。该园区由芯空间管理运营，专注于集成电路及数字经济核心产业，提供多元化服务模块和5亿集成电路产业基金支持。同时，大运河数智城将围绕“1+2+X”创新布局，深化校地协同，加快产业链延伸和成果转化。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655958538&idx=1&sn=f9bf5a4c18d5af992a0a7828c9d28f7e"
    },
    "relatedCompanies": []
  },
  "1010": {
    "type": "科技创新",
    "title": "廉毅敏在杭州宣讲全国两会精神并调研：打造一流创新生态 激发创新创造活力",
    "date": "2026-03-19",
    "source": "拱墅发布",
    "summary": "省政协主席廉毅敏在杭州宣讲全国两会精神并调研，强调深入学习贯彻习近平总书记重要讲话和全国两会精神，加快建设一流创新生态，打造最具竞争力营商环境，促进民营经济高质量发展。他考察了杭州医药港小镇、科技企业等，对科技创新、产业链布局等方面提出要求。同时，强调要加强人才‘引育留用’，一体培育发展大中小企业，优化创新要素配置，推动政策服务提质增效，为‘十五五’开好局起好步贡献智慧力量。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655958537&idx=1&sn=9b71972685056e15231d116dfcf6bc08"
    },
    "relatedCompanies": []
  },
  "1011": {
    "type": "文旅宣传",
    "title": "运河畔，正批量生长“一人军团”",
    "date": "2026-03-17",
    "source": "拱墅发布",
    "summary": "本文报道了拱墅区在人工智能领域的发展情况，特别是针对一人公司（OPC）的创新模式。文章介绍了杭州积甲科技发展有限公司作为一家小团队利用AI工具推动文化遗产保护和文博文创产业发展的案例，并讨论了拱墅区如何通过政策扶持和资源整合来促进人工智能产业发展。此外，还提到了武林数字产业园内即将揭幕的OPC创业平台，以及拱墅区在资本支持方面的举措。",
    "sourceLink": {
      "label": "拱墅发布",
      "url": "https://mp.weixin.qq.com/s?__biz=MjM5OTUyNzY0NA==&mid=2655958297&idx=1&sn=3493ae74c463fb665a7243e32f3d2c7f"
    },
    "relatedCompanies": [
      {
        "id": 1011,
        "name": "杭州积甲科技发展有限公司",
        "detailUrl": "/company-detail/1953686879668846594"
      }
    ]
  }
};

const DEFAULT_DETAIL = {
  type: '场景动态',
  title: '拱墅数商产业园正式启动,多家企业入驻',
  date: '2026-04-01',
  source: '人民日报',
  summary: '摘要: 杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元,本轮融资将用于技术研发和市场拓展。',
  paragraphs: [
    '杭州市创新科技有限公司近日宣布完成A轮融资,融资金额达3000万元。本轮融资由知名投资机构领投,多家产业资本跟投。据悉,本轮融资将主要用于人工智能技术的研发、产品迭代以及市场推广。',
    '公司创始人张伟表示:"非常感谢投资方的信任与支持。本轮融资将加速我们在人工智能领域的布局,我们将继续专注于为企业客户提供更优质的智能化解决方案。"',
    '业内专家认为,随着数字化转型的深入,企业对智能化服务的需求日益增长,深圳市创新科技有限公司在这一领域具有较强的竞争优势。',
  ],
  relatedCompanies: [
    {
      id: 1,
      name: '杭州市创新科技有限公司',
      industry: '软件和信息技术服务业',
      legalPerson: '张伟',
      status: '存续',
    },
  ],
};

export default function SceneEnterpriseDynamicDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const stateData = location.state?.dynamicData;
  const data = stateData || MOCK_DETAIL_DATA[Number(id)] || DEFAULT_DETAIL;

  function getTitle() {
    return data.category == 'recommend' ? '每日推荐' : data.type
  }

  // 类型到样式类名的映射
  const getBadgeClass = (type, category) => {
    // 保留原有类别样式
    if (category) {
      return `sedd-badge--${category}`;
    }
    
    // 新增类型的样式映射
    const typeMap = {
      '调研走访': 'sedd-badge--news',
      '政策法规': 'sedd-badge--recommend',
      '为企服务': 'sedd-badge--service',
      '数据要素': 'sedd-badge--related',
      '科技创新': 'sedd-badge--tech',
      '商务社区': 'sedd-badge--business',
      '城市建设': 'sedd-badge--city',
      '文旅宣传': 'sedd-badge--recommend'
    };
    return typeMap[type] || '';
  };

  // 类型到绿色圆点样式类名的映射
  const getGreenDotClass = (type, category) => {
    // 保留原有类别样式
    if (category) {
      return `sedd-green-dot--${category}`;
    }
    
    // 新增类型的样式映射
    const typeMap = {
      '调研走访': 'sedd-green-dot--news',
      '政策法规': 'sedd-green-dot--recommend',
      '为企服务': 'sedd-green-dot--service',
      '数据要素': 'sedd-green-dot--related',
      '科技创新': 'sedd-green-dot--tech',
      '商务社区': 'sedd-green-dot--business',
      '城市建设': 'sedd-green-dot--city',
      '文旅宣传': 'sedd-green-dot--recommend'
    };
    return typeMap[type] || '';
  };

  return (
    <div className="sedd-container">
      {/* ===== 头部 ===== */}
      {/* <div className="sedd-header">
        <div className="sedd-header-row">
          <button className="sedd-back-btn" onClick={() => navigate(-1)} aria-label="返回">
            <img src={iconBack} alt="返回" width={36} height={32} />
          </button>
          <span className="sedd-header-title">动态详情</span>
        </div>
      </div> */}
      <PageHeader title={getTitle()} />

      {/* ===== 主体区域（可滚动） ===== */}
      <div className="sedd-body">
        {/* ===== 动态基本信息卡片 ===== */}
        <div className="sedd-card">
          <div className="sedd-card-content">
            {/* 顶部信息区域 */}
            <div className="sedd-info-section">
              {/* 类型标签 */}
              <div className="sedd-badge-wrapper">
                <div className={`sedd-badge ${getBadgeClass(data.type, data.category)}`}>{data.type}</div>
              </div>

              {/* 标题行 */}
              <div className="sedd-title-row">
                <div className="sedd-title-inner">
                  <div className={`sedd-green-dot ${getGreenDotClass(data.type, data.category)}`} />
                  <span className="sedd-title">{data.title}</span>
                </div>
              </div>

              {/* 来源 + 日期行 */}
              <div className="sedd-meta-row-wrapper">
                <div className="sedd-meta-row">
                  {data.source && <div className="sedd-meta-item">
                    <img src={iconNewspaper} alt="来源" width={12} height={12} />
                    <span className="sedd-meta-text">{data.source}</span>
                  </div>}
                  <div className="sedd-meta-item">
                    <img src={iconCalendar} alt="日期" width={12} height={12} />
                    <span className="sedd-meta-text">{data.date}</span>
                  </div>
                </div>
                {
                  data.category == 'recommend' && data.link && (
                    <div className="sedd-meta-item" onClick={() => navigate(data.link)}>
                      <a className="sedd-link-text">查看企业 →</a>
                    </div>
                  )
                }
              </div>

            </div>

            {/* 分隔线 */}
            <div className="sedd-separator" />

            {/* 摘要区域 */}
            <div className="sedd-summary-box">
              <p className="sedd-summary-text">{data.category == 'recommend' ?
                <span className="sedd-summary--bold">推荐理由：</span> :
                <span className="sedd-summary--bold">摘要: </span>}
                {data.summary}
                {
                  data.subSummary && (
                    <>
                      <br></br>
                      {data.subSummary}
                    </>
                  )
                }</p>
            </div>

            {/* 来源链接按钮 */}
            {data.sourceLink && (
              <a
                className="sedd-source-link-btn"
                href={data.sourceLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sedd-source-link-icon">
                  <img src={iconLinkBlue} alt="🔗" width={16} height={16} />
                </span>
                <span className="sedd-source-link-label">{data.sourceLink.label}</span>
              </a>
            )}

            {/* 正文段落 */}
            {data.paragraphs && data.paragraphs.length > 0 ? data.category == 'recommend' ?
              <div className="sedd-summary-box">
                <p className="sedd-summary-text"> <span className="sedd-summary--green">企业简介：</span>  {data.paragraphs[0]}</p>
              </div> : <div className="sedd-paragraphs">
                {data.paragraphs.map((para, index) => (
                  <p key={index} className="sedd-paragraph">{para}</p>
                ))}
              </div> : null}


          </div>
        </div>

        {/* ===== 关联部门信息卡片 ===== */}
        {data.relatedDepartments && data.relatedDepartments.length > 0 &&
          <div className="sedd-card">
            <div className="sedd-card-content">
              {/* 卡片标题 */}
              <div className="sedd-section-header">
                <img src={iconBuilding} alt="关联企业" width={16} height={16} />
                <span className="sedd-section-title">关联部门</span>
                <span className="sedd-section-count">({data.relatedDepartments.length}个)</span>
              </div>

              {/* 企业列表 */}
              <div className="sedd-company-list">
                {data.relatedDepartments.map((department) => (
                  <div key={department.id} className="sedd-company-item">
                    {/* 企业信息行 */}
                    <div className="sedd-company-main">
                      {/* 左侧：名称 + 基本信息 */}
                      <div className="sedd-company-left">
                        <div className="sedd-department-name">{department.name}</div>
                        <div className="sedd-company-info">
                          <span className="sedd-company-industry">{department.street}</span>
                        </div>
                      </div>
                      {/* 右侧：状态标签 */}
                      <div className="sedd-person">{department.legalPerson}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>}

        {/* ===== 关联企业信息卡片 ===== */}
        {data.relatedCompanies && data.relatedCompanies.length > 0 &&
          <div className="sedd-card">
            <div className="sedd-card-content">
              {/* 卡片标题 */}
              <div className="sedd-section-header">
                <img src={iconBuilding} alt="关联企业" width={16} height={16} />
                <span className="sedd-section-title">关联企业</span>
                <span className="sedd-section-count">({data.relatedCompanies.length}家)</span>
              </div>

              {/* 企业列表 */}
              <div className="sedd-company-list">
                {data.relatedCompanies.map((company) => (
                  <div key={company.id} className="sedd-company-item">
                    {/* 企业信息行 */}
                    <div className="sedd-company-main">
                      {/* 左侧：名称 + 基本信息 */}
                      <div className="sedd-company-left">
                        <div className="sedd-company-name">{company.name}</div>
                        {company.legalPerson && company.industry && <div className="sedd-company-info">
                          <span className="sedd-company-industry">{company.industry}</span>
                          <span className="sedd-company-dot">•</span>
                          <span className="sedd-company-person">{company.legalPerson}</span>
                        </div>}
                      </div>
                      {/* 右侧：状态标签 */}
                      {company.status && company.category != 'news' && <div className="sedd-status-badge">{company.status}</div>}
                      {company.detailUrl && <div className="sedd-company-detail-row" onClick={() => navigate(company.detailUrl)}>
                        <span className="sedd-company-detail-link">查看企业 →</span>
                      </div>}
                    </div>
                    {/* 查看详情 */}
                    {/* {data.category != 'news' && <div className="sedd-company-detail-row">
                      <span className="sedd-company-detail-link">查看详情 →</span>
                    </div>} */}
                  </div>
                ))}
              </div>
            </div>
          </div>}
      </div>
    </div>
  );
}
