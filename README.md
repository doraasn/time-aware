# Time Aware Skill

一个为 AI 助手设计的时间感知技能，自动检测用户的时间性问题并获取准确的当前时间。

## 功能特性

- **自动检测时间性词语**：识别"今天"、"明天"、"昨天"、"本周"、"下周"等时间相关词汇
- **多平台支持**：支持 Windows、macOS、Linux、Android (Termux)
- **准确时间获取**：使用系统原生命令获取准确时间，避免假设
- **智能时间分析**：计算相对时间，提供完整的时间上下文

## 安装

```bash
git clone https://github.com/doraasn/time-aware-skill.git
cd time-aware-skill
npm install
```

## 使用方法

### 作为模块使用

```javascript
const TimeAwareSkill = require('./index.js');

const skill = new TimeAwareSkill();

// 检测时间性词语
const words = skill.detectTimeWords('今天天气怎么样？');
console.log(words); // ['今天']

// 获取当前时间
const time = skill.getCurrentTime();
console.log(time); // '2026-07-02 09:54:00 星期四'

// 生成完整响应
const response = skill.generateResponse('今天是星期几？');
console.log(response);
```

### 命令行测试

```bash
node test.js
```

## 支持的时间词语

- **日**：今天、明天、昨天、后天、前天
- **周**：本周、上周、下周、这周
- **月**：本月、上月、下月
- **时间点**：现在、当前、此刻、刚才
- **相对时间**：最近、之前、以后、未来
- **星期**：周几、星期几、礼拜几

## 平台支持

| 平台 | 状态 | 时间获取方式 |
|------|------|-------------|
| Windows | ✅ | PowerShell `Get-Date` |
| macOS | ✅ | `date` 命令 |
| Linux | ✅ | `date` 命令 |
| Android (Termux) | ✅ | `date` 命令 |

## 工作原理

1. **检测阶段**：扫描用户消息中的时间性词语
2. **获取阶段**：使用系统命令获取准确的当前时间
3. **分析阶段**：计算相对时间，生成时间上下文
4. **响应阶段**：基于准确时间生成回答

## 示例输出

```
⏰ 当前时间: 2026-07-02 09:54:00 星期四

检测到时间词语: 今天

时间信息:
- 今天: 2026-07-02 星期四
- 明天: 2026-07-03 星期五
- 昨天: 2026-07-01 星期三
- 本周: 2026-06-29 星期一 至 2026-07-05 星期日
```

## 许可证

MIT License
