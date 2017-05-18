const features = [
  '年',
  '月',
  '工作',
  '副',
  '男',
  '参加',
  '汉族',
  '研究',
  '主任',
  '大学',
  '书记',
  '党组',
  '专业',
  '研究生',
  '委员',
  '学历',
  '成员',
  '学院',
  '学习',
  '组成',
  '加入',
  '管理',
  '共产',
  '中央',
  '中国共产党',
  '政府',
  '办公',
  '常委',
  '经济',
  '现任',
  '毕业',
  '党委',
  '硕士',
  '人民',
  '干部',
  '市委',
  '党组书记',
  '其间',
  '党校',
  '在职',
  '学位',
];

const years = [];
const startYear = 1950;
const limitYear = 2018;
for (let year = startYear; year < limitYear; year++) {
  years.push(year.toString());
}

function check(text) {
  let num = 0;
  features.forEach((word) => {
    if (text.indexOf(word) !== -1) {
      num++;
    }
  });
  let level = 0;
  years.forEach((year) => {
    if (text.indexOf(year) !== -1) {
      level++;
    }
  });
  if (level > 0) {
    num += 1;
  }
  if (level > 3) {
    num += 2;
  }
  if (level > 7) {
    num += 2;
  }
  return num;
}

module.exports = check;
