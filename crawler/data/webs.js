var gov = {
  '0': {
    org: '国务院',
    url: 'http://www.gov.cn/guowuyuan/index.htm',
    domain: 'www.gov.cn',
    crawl: /guowuyuan\/[a-z]+\/index\.htm/,
    follow: /(guoqing\/20[0-1]\d\-[\d]{2}\/[\d]{2}\/content\_[\d]+\.htm)|(guowuyuan\/[a-z]+\/index\.htm)/,
    pattern: { name: 'h1' },
    depth: 0
  },
  '1': {
    org: '外交部',
    url: 'http://www.fmprc.gov.cn/web/wjb_673085/zygy_673101/',
    domain: 'www.fmprc.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: { resume: 'td' },
    depth: 0
  },
  '2': {
    org: '教育部',
    url: 'http://www.moe.gov.cn/jyb_zzjg/moe_187/',
    domain: 'www.moe.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '3': {
    org: '国防部',
    url: 'http://www.mod.gov.cn/leaders/index.htm',
    domain: 'www.mod.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '4': {
    org: '工业与信息化部',
    url: 'http://www.miit.gov.cn/n1146285/n1146347/index.html',
    domain: 'www.miit.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '5': {
    org: '发改委',
    url: 'http://www.ndrc.gov.cn/',
    domain: 'www.ndrc.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '6': {
    org: '科学技术部',
    url: 'http://www.most.gov.cn/zzjg/',
    domain: 'www.most.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '7': {
    org: '民族事务委员会',
    url: 'http://www.seac.gov.cn/col/col9811/index.html',
    domain: 'www.seac.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '8': {
    org: '公安部',
    url: 'http://www.mps.gov.cn/n2254314/n2254315/n2254317/n2254375/n2254376/c4089040/content.html',
    domain: 'www.mps.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '9': {
    org: '监察部',
    url: 'http://www.ccdi.gov.cn/xxgk/ldjg/',
    domain: 'www.ccdi.gov.cn',
    crawl: /\/xxgk\/ldjg\/[a-z]*\/[\d]+\/[a-z0-9]+\_[\d]+\.html/,
    follow: /xxgk\/ldjg\/[a-z]*/,
    pattern: { name: 'h2.tit' },
    depth: 0
  },
  '10': {
    org: '民政部',
    url: 'http://www.mca.gov.cn/',
    domain: 'www.mca.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '11': {
    org: '司法部',
    url: 'http://www.moj.gov.cn/zt/content/2016-02/19/content_6490795.htm?node=57228',
    domain: 'www.moj.gov.cn',
    crawl: /6490795/,
    follow: /6490795/,
    pattern: { name: '.f14 font', resume: '.f14' },
    depth: 0
  },
  '12': {
    org: '财政部',
    url: 'http://www.mof.gov.cn/index.htm',
    domain: 'www.mof.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '13': {
    org: '国土资源部',
    url: 'http://www.mlr.gov.cn/zwgk/',
    domain: 'www.mlr.gov.cn',
    crawl: /\/ldzc\/[a-z]+\//,
    follow: /\/ldzc\/[a-z]+\//,
    pattern: { name: '.ldzc_name' },
    depth: 0,
    max_depth: 1,
    charset: 'gb2312'
  },
  '14': {
    org: '人资与社保部',
    url: 'http://www.mohrss.gov.cn/',
    domain: 'www.mohrss.gov.cn',
    crawl: /\/SYrlzyhshbzb\/zwgk\/bld\//, // http://www.mohrss.gov.cn/SYrlzyhshbzb/zwgk/bld/ywm/
    follow: /\/SYrlzyhshbzb\/zwgk\/bld\//,
    pattern: {},
    depth: 0,
    max_depth: 1
  },
  '15': {
    org: '住房城建部',
    url: 'http://www.mohurd.gov.cn/bld/index.html',
    domain: 'www.mohurd.gov.cn',
    crawl: /\/bld\/[a-z]+\/index/, // http://www.mohurd.gov.cn/bld/czg/index.html
    follow: /\/bld\/[a-z]+\/index/,
    pattern: {},
    depth: 0
  },
  '16': {
    org: '交通运输部', // ok
    url: 'http://www.moc.gov.cn/jigou/',
    domain: 'www.moc.gov.cn',
    crawl: /buzhangwangye/, // http://www.moc.gov.cn/buzhangwangye/yangchuantang/
    follow: /buzhangwangye/,
    pattern: {},
    depth: 0,
    max_depth: 1,
    charset: 'utf-8'
  },
  '17': {
    org: '环保部',
    url: 'http://www.mep.gov.cn/',
    domain: 'mep.gov.cn',
    crawl: /grjl/, // http://chenjining.mep.gov.cn/grjl/
    follow: /http\:\/\/[a-z]+\.mep\.gov\.cn\/($|grjl)/,
    pattern: {},
    depth: 0,
    max_depth: 2,
    charset: 'utf-8'
  },
  '18': {
    org: '农业部',
    url: 'http://www.moa.gov.cn/leaders/ldjs/201312/t20131224_3722392.htm',
    //url: 'http://www.moa.gov.cn/leaders/mag/jianli/201702/t20170209_5471514.htm',
    domain: 'www.moa.gov.cn',
    //crawl: /./,
    //follow: /./,
    crawl: /leaders\/[a-z]+\/jianli/, // http://www.moa.gov.cn/leaders/hanchangfu/
    follow: /leaders\/[a-z]+/,
    pattern: { name: '.lefter' },
    depth: 0,
    max_depth: 1,
    charset: 'utf-8'
  },
  '19': {
    org: '商务部',
    url: 'http://www.mofcom.gov.cn',
    //url: 'http://lichenggang.mofcom.gov.cn/',
    domain: 'mofcom.gov.cn',
    crawl: /article\/resume/, // http://zhongshan.mofcom.gov.cn/article/resume/200812/20081205970196.shtml
    follow: /http\:\/\/[a-z]{6,}\.mofcom\.gov\.cn\/($|article\/resume)/,
    pattern: { name: 'h1' },
    depth: 0,
    max_depth: 2,
    charset: 'utf-8'
  },
  '20': {
    org: '水利部',
    url: 'http://www.mwr.gov.cn/zwzc/ldxx/',
    //url: 'http://www.mwr.gov.cn/zwzc/ldxx/cl/ldjj/',
    domain: 'www.mwr.gov.cn',
    crawl: /ldjj/, // http://www.mwr.gov.cn/zwzc/ldxx/cl/ldjj/
    follow: /zwzc\/ldxx\/[a-z]+\/($|ldjj\/$)/, // http://www.mwr.gov.cn/zwzc/ldxx/cl/
    pattern: { name: 'p' },
    depth: 0,
    max_depth: 2,
    charset: 'utf-8'
  },
  '21': {
    org: '文化部',
    url: 'http://www.mcprc.gov.cn/gywhb/ldzz/',
    domain: 'www.mcprc.gov.cn',
    crawl: /gywhb\/ldzz\/[a-z]{3,}\//, // http://www.mcprc.gov.cn/gywhb/ldzz/luoshugang/201505/t20150526_441175.htm
    follow: /gywhb\/ldzz\/[a-z]{3,}\//,
    pattern: {},
    depth: 0
  },
  '22': {
    org: '卫生部',
    url: 'http://www.nhfpc.gov.cn/zhuz/ldxx/ldxx.shtml', //http://www.nhfpc.gov.cn/zhuz/ldxx/201612/0ca5a318def44e968d1b6baf0b42b720.shtml
    domain: 'www.nhfpc.gov.cn',
    crawl: /grjl|ldxx/,
    follow: /grjl|ldxx/, // http://www.nhfpc.gov.cn/libin/grjl/201303/36306879c06745ee881bdb10d1589df0.shtml
    pattern: { name: '.tit' },
    depth: 0
  },
  '23': {
    org: '中国人民银行',
    url: 'http://www.pbc.gov.cn/hanglingdao/128697/128728/index.html',
    domain: 'www.pbc.gov.cn',
    crawl: /./, // http://www.pbc.gov.cn/hanglingdao/128697/128719/index.html
    follow: /./,
    pattern: { name: 'p' },
    depth: 0
  },
  '24': {
    org: '审计署',
    url: 'http://www.audit.gov.cn/n10/n15/index.html',
    domain: 'www.audit.gov.cn',
    crawl: /./, //http://www.audit.gov.cn/n10/n15/n125/n126/c12563/content.html
    follow: /./,
    pattern: {},
    depth: 0
  }
}

var province = {
  '0': {
    org: '北京',
    //url: 'http://shilingdao.beijing.gov.cn/library/191/5/6/11/413919/1239/index.html', //市委领导
    //url: 'http://shilingdao.beijing.gov.cn/library/191/5/7/15/413927/142141/index.html', //市人大
    //url: 'http://shilingdao.beijing.gov.cn/library/191/5/8/18/413933/84711/index.html', //市政府
    url: 'http://shilingdao.beijing.gov.cn/library/191/5/9/21/413939/1256/index.html', //市政协
    domain: 'shilingdao.beijing.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: { resume: '.ld_jj' },
    depth: 0
  },
  '1': {
    org: '天津',
    url: 'http://www.tj.gov.cn/szf/',
    domain: 'www.tj.gov.cn',
    crawl: /szf\/zfld/,
    follow: /szf\/zfld/,
    pattern: { resume: '.zw' },
    depth: 0
  },
  '2': {
    org: '上海',
    url: 'http://wsxf.sh.gov.cn/xf_swldxx/resume_HZ.aspx?LeaderName=%E9%9F%A9%E6%AD%A3',
    domain: 'wsxf.sh.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: { resume: '#resumeContent' },
    depth: 0
  },
  '3': {
    org: '重庆',
    url: 'http://www.cq.gov.cn/zfxx/index.shtml',
    domain: 'www.cq.gov.cn',
    crawl: /zfld\/szfld\/.*mayor/, // /zfld/szfld/vicemayor/
    follow: /zfld\/szfld\/.*mayor/,
    pattern: {},
    depth: 0
  },
  '4': {
    org: '河北',
    url: 'http://www.hebei.gov.cn/hebei/11937442/10756074/10758847/index.html',
    domain: 'www.hebei.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '5': {
    org: '山西',
    url: 'http://www.shanxi.gov.cn/xxgk/',
    domain: 'www.shanxi.gov.cn',
    crawl: /szfld/,
    follow: /szfld/,
    pattern: {},
    depth: 0
  },
  '6': {
    org: '辽宁',
    url: 'http://www.ln.gov.cn/zfxx/zfld/',
    domain: 'www.ln.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: { resume: '.neirong' },
    depth: 0,
    charset: 'gb2312'
  },
  '7': {
    org: '吉林',
    url: 'http://www.jl.gov.cn/sz_77296/wdjl/',
    domain: 'www.jl.gov.cn',
    crawl: /./,
    follow: /zfld/,
    pattern: {},
    depth: 0
  },
  '8': {
    org: '黑龙江',
    url: 'http://www.hlj.gov.cn/szf/',
    domain: 'www.hlj.gov.cn',
    crawl: /./,
    follow: /lddt/,
    pattern: {},
    depth: 0,
    charset: 'gb2312'
  },
  '9': {
    org: '福建',
    url: 'http://www.fujian.gov.cn/szf/szfld/sz/',
    domain: 'www.fujian.gov.cn',
    crawl: /./,
    follow: /szfld/,
    pattern: {},
    depth: 0
  },
  '10': {
    org: '江西',
    url: 'http://www.jiangxi.gov.cn/kzw/jxszfxxgkml/zfjg/zfld_12550/',
    domain: 'www.jiangxi.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: { name: '.columnXLBT' },
    depth: 0
  },
  '11': {
    org: '山东',
    url: 'http://www.shandong.gov.cn/col/col120/index.html',
    domain: 'www.shandong.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '12': {
    org: '河南',
    url: 'http://www.henan.gov.cn/zwgk/zfld/',
    domain: 'www.henan.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0,
    charset: 'gb2312'
  },
  '13': {
    org: '湖北',
    url: 'http://www.hubei.gov.cn/zwgk/zfld/szzc/sld01/',
    domain: 'www.hubei.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '14': {
    org: '湖南',
    url: 'http://www.hunan.gov.cn/zw/zfld/',
    domain: 'www.hunan.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: { resume: 'dd' },
    depth: 0
  },
  '15': {
    org: '广东',
    url: 'http://www.gd.gov.cn/govpub/',
    domain: 'www.gd.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '16': {
    org: '海南',
    url: 'http://www.hainan.gov.cn/2016/szf.php',
    domain: 'www.hainan.gov.cn',
    crawl: /sldjl/,
    follow: /sld/,
    pattern: {},
    depth: 0,
    max_depth: 2,
    charset: 'gk2312'
  },
  '17': {
    org: '四川',
    url: 'http://www.sc.gov.cn/10462/10605/13742/13777/2016/6/8/10385289.shtml',
    domain: 'www.sc.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0,
    max_depth: 2,
    charset: 'gb2312'
  },
  '18': {
    org: '贵州',
    url: 'http://www.gzgov.gov.cn/zyzx/ldr_778/',
    domain: 'www.gzgov.gov.cn',
    crawl: /./,
    follow: /ldr_778/,
    pattern: { resume: '.p3' },
    depth: 0
  },
  '19': {
    org: '云南',
    url: 'http://www.yn.gov.cn/ld/index.html',
    domain: 'www.yn.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0,
    charset: 'gb2312'
  },
  '20': {
    org: '内蒙古',
    url: 'http://www.nmg.gov.cn/zzqzf/',
    domain: 'www.nmg.gov.cn',
    crawl: /./,
    follow: /zfld/,
    pattern: {},
    depth: 0
  },
  '21': {
    org: '广西',
    //url: 'http://www.gxzf.gov.cn/frame/201203/t20120314_409917.htm',
    url: 'http://xxgk.gxzf.gov.cn:8080/govinfo/documentAction.do?method=toDocView&docId=1f15f667-fc59-4cb6-baa0-6ea177ce54c2&moduleId=4028e6813076f86c013077388b2d0004&orgId=34',
    domain: 'www.gxzf.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: { name: 'strong' },
    depth: 0
  },
  '22': {
    org: '西藏',
    url: 'http://www.xizang.gov.cn/zwgk/ldzc/201701/t20170116_118350.html',
    domain: 'www.xizang.gov.cn',
    crawl: /./,
    follow: /ldzc/,
    pattern: {},
    depth: 0
  },
  '23': {
    org: '宁夏',
    url: 'http://www.nx.gov.cn/zichigouzhuxi.htm',
    domain: 'www.nx.gov.cn',
    crawl: /./,
    follow: /ldzc/,
    pattern: { name: 'h1' },
    depth: 0
  },
  '24': {
    org: '新疆',
    url: 'http://www.xinjiang.gov.cn/index.html',
    domain: 'www.xinjiang.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '25': {
    org: '江苏',
    url: 'http://www.js.gov.cn/hdjl/szxx/',
    domain: 'www.js.gov.cn',
    crawl: /./,
    follow: /szfld/,
    pattern: { name: '.header_example' },
    depth: 0
  },
  '26': {
    org: '浙江',
    url: 'http://www.zj.gov.cn/col/col40951/index.html',
    domain: 'www.zj.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0
  },
  '27': {
    org: '安徽',
    url: 'http://www.ah.gov.cn/TMP/leader.shtml',
    domain: 'www.ah.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: {},
    depth: 0,
    charset: 'gb2312'
  },
  '28': {
    org: '陕西',
    url: 'http://www.shaanxi.gov.cn/info/iIndex.jsp?cat_id=10011',
    domain: 'www.shaanxi.gov.cn',
    crawl: /./,
    follow: /./,
    pattern: { name: 'p' },
    depth: 0
  },
  '29': {
    org: '甘肃',
    url: 'http://www.gansu.gov.cn/art/2014/7/28/art_4465_201.html',
    domain: 'www.gansu.gov.cn',
    crawl: /art/,
    follow: /col|art/,
    pattern: { name: 'p' },
    depth: 0
  },
  '30': {
    org: '青海',
    url: 'http://www.qh.gov.cn/zwgk/ldzc/wangzhengsheng/jj/index.html',
    domain: 'www.qh.gov.cn',
    crawl: /ldzc/,
    follow: /ldzc/,
    pattern: { resume: '*' },
    depth: 0
  }
}

module.exports = { gov: gov, province: province };
