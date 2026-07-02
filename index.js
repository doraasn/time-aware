#!/usr/bin/env node

/**
 * Time Aware Skill
 * 获取当前时间并分析时间相关问题
 */

const { execSync } = require('child_process');
const os = require('os');

class TimeAwareSkill {
  constructor() {
    this.platform = this.detectPlatform();
  }

  /**
   * 检测当前平台
   */
  detectPlatform() {
    const platform = os.platform();
    switch (platform) {
      case 'win32':
        return 'windows';
      case 'darwin':
        return 'macos';
      case 'linux':
        // 检测是否是 Android (Termux)
        if (process.env.TERMUX_VERSION || process.env.SHELL?.includes('termux')) {
          return 'android';
        }
        return 'linux';
      default:
        return 'unknown';
    }
  }

  /**
   * 获取当前时间
   */
  getCurrentTime() {
    try {
      let command;
      let format = 'yyyy-MM-dd HH:mm:ss dddd';

      switch (this.platform) {
        case 'windows':
          command = `Get-Date -Format "${format}"`;
          return execSync(`powershell -Command "${command}"`, { encoding: 'utf-8' }).trim();
        
        case 'macos':
        case 'linux':
        case 'android':
          command = `date "+%Y-%m-%d %H:%M:%S %A"`;
          return execSync(command, { encoding: 'utf-8' }).trim();
        
        default:
          return new Date().toISOString();
      }
    } catch (error) {
      console.error('获取时间失败:', error.message);
      return null;
    }
  }

  /**
   * 解析时间字符串为 Date 对象
   */
  parseTime(timeString) {
    return new Date(timeString);
  }

  /**
   * 计算相对时间
   */
  getRelativeTime(daysOffset = 0) {
    const now = new Date();
    const target = new Date(now);
    target.setDate(target.getDate() + daysOffset);
    return target;
  }

  /**
   * 格式化日期
   */
  formatDate(date, format = 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
      .replace('dddd', weekday);
  }

  /**
   * 检测消息中的时间性词语
   */
  detectTimeWords(message) {
    const timeWords = [
      '今天', '明天', '昨天', '后天', '前天',
      '本周', '上周', '下周', '这周', '那周',
      '本月', '上月', '下月', '这个月', '上个月', '下个月',
      '现在', '当前', '目前', '此刻',
      '最近', '近来', '最近几天',
      '刚才', '刚刚', '方才',
      '之前', '以前', '从前', '过去',
      '之后', '以后', '将来', '未来',
      '下周二', '下周三', '下周一', '下周四', '下周五',
      '这周二', '这周三', '周一周', '周四', '周五',
      '星期', '周几', '礼拜',
      '几点', '什么时候', '何时', '几号',
      '日程', '计划', '安排', '会议', '截止', 'deadline'
    ];

    const detected = timeWords.filter(word => message.includes(word));
    return detected;
  }

  /**
   * 分析时间问题
   */
  analyzeTimeQuestion(message) {
    const detectedWords = this.detectTimeWords(message);
    
    if (detectedWords.length === 0) {
      return {
        hasTimeReference: false,
        detectedWords: [],
        currentTime: null,
        analysis: null
      };
    }

    const currentTime = this.getCurrentTime();
    const now = this.parseTime(currentTime);

    return {
      hasTimeReference: true,
      detectedWords: detectedWords,
      currentTime: currentTime,
      analysis: {
        today: this.formatDate(now, 'YYYY-MM-DD dddd'),
        tomorrow: this.formatDate(this.getRelativeTime(1), 'YYYY-MM-DD dddd'),
        yesterday: this.formatDate(this.getRelativeTime(-1), 'YYYY-MM-DD dddd'),
        thisWeekStart: this.getWeekStart(now),
        thisWeekEnd: this.getWeekEnd(now)
      }
    };
  }

  /**
   * 获取本周开始日期
   */
  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return this.formatDate(d, 'YYYY-MM-DD dddd');
  }

  /**
   * 获取本周结束日期
   */
  getWeekEnd(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() + (7 - day);
    d.setDate(diff);
    return this.formatDate(d, 'YYYY-MM-DD dddd');
  }

  /**
   * 生成时间感知的回答
   */
  generateResponse(message) {
    const analysis = this.analyzeTimeQuestion(message);
    
    if (!analysis.hasTimeReference) {
      return null;
    }

    let response = `⏰ 当前时间: ${analysis.currentTime}\n\n`;
    
    if (analysis.detectedWords.length > 0) {
      response += `检测到时间词语: ${analysis.detectedWords.join(', ')}\n\n`;
    }

    response += `时间信息:\n`;
    response += `- 今天: ${analysis.analysis.today}\n`;
    response += `- 明天: ${analysis.analysis.tomorrow}\n`;
    response += `- 昨天: ${analysis.analysis.yesterday}\n`;
    response += `- 本周: ${analysis.analysis.thisWeekStart} 至 ${analysis.analysis.thisWeekEnd}\n`;

    return response;
  }
}

// 导出模块
module.exports = TimeAwareSkill;

// 命令行运行时执行
if (require.main === module) {
  const skill = new TimeAwareSkill();
  
  // 获取当前时间
  console.log('=== Time Aware Skill ===');
  console.log('平台:', skill.platform);
  console.log('当前时间:', skill.getCurrentTime());
  
  // 测试时间检测
  const testMessages = [
    '今天天气怎么样？',
    '我明天有个会议',
    '下周二几点开始？',
    '最近有什么新闻？',
    '现在几点了？'
  ];

  console.log('\n=== 时间检测测试 ===');
  testMessages.forEach(msg => {
    console.log(`\n消息: "${msg}"`);
    const result = skill.generateResponse(msg);
    if (result) {
      console.log(result);
    } else {
      console.log('未检测到时间性词语');
    }
  });
}
