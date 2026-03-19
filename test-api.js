

async function testApi() {
  try {
    const res = await fetch('https://sjch5.gongshu.gov.cn/pbdm-api/backend/sceneRadar/dataCountInfo', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Origin': 'https://bi.gongshu.gov.cn',
        'User-Agent': 'Mozilla/5.0',
        'YICALL-SECRET-KEY': 'CQ2Fgiaux3Ml9qoO',
        'Cookie': 'YICALLTOKENADMIN=069e81df-53d0-4bf5-9e14-a73d8f1630be'
      },
      body: JSON.stringify({
        selectDate: '2026-03-18',
        sceneName: '人工智能'
      })
    });
    const text = await res.text();
    console.log(text);
  } catch(e) {
    console.error(e);
  }
}
testApi();
