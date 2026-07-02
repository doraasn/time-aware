#!/usr/bin/env node

/**
 * Time Aware Skill 测试
 */

const TimeAwareSkill = require('./index.js');

console.log('=== Time Aware Skill 测试 ===\n');

const skill = new TimeAwareSkill();

// 测试 1: 平台检测
console.log('1. 平台检测');
console.log('当前平台:', skill.platform);
console.log('');

// 测试 2: 获取当前时间
console.log('2. 获取当前时间');
const currentTime = skill.getCurrentTime();
console.log('当前时间:', currentTime);
console.log('');

// 测试 3: 时间检测
console.log('3. 时间检测测试');
const testCases = [
  '今天天气怎么样？',
  '我明天有个会议',
  '下周二几点开始？',
  '最近有什么新闻？',
  '现在几点了？',
  '昨天发生了什么？',
  '这周五有空吗？',
  '下个月的计划是什么？',
  '刚才你说什么？',
  '以前的事情了',
  '未来会怎样？',
  '普通的没有时间的问题'
];

testCases.forEach((msg, index) => {
  console.log(`\n测试 ${index + 1}: "${msg}"`);
  const detectedWords = skill.detectTimeWords(msg);
  if (detectedWords.length > 0) {
    console.log('  检测到时间词语:', detectedWords.join(', '));
    const analysis = skill.analyzeTimeQuestion(msg);
    console.log('  时间分析:', JSON.stringify(analysis.analysis, null, 2));
  } else {
    console.log('  未检测到时间性词语');
  }
});

// 测试 4: 生成完整响应
console.log('\n\n4. 生成完整响应测试');
const response = skill.generateResponse('今天是星期几？');
console.log(response);

console.log('\n=== 测试完成 ===');
