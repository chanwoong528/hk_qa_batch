const express = require('express');
const app = express();
const cron = require('node-cron');

const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');

async function backupAndFlushBullMQData() {
  const redis = new Redis();
  const backupFile = path.join(__dirname, `../logs/bullmq_backup${curDateFileNameFormat()}.txt`);
  const writeStream = fs.createWriteStream(backupFile, { flags: 'a' });

  try {
    // 모든 BullMQ 키를 가져옴
    const keys = await redis.keys('bull:queue:*');

    for (const key of keys) {
      try {
        const keyType = await redis.type(key);

        if (keyType === 'hash') {
          const data = await redis.hgetall(key);

          // 데이터를 문자열로 포맷
          let formattedData = `Key: ${key}\n`;
          for (const [field, value] of Object.entries(data)) {
            let parsedValue;
            try {
              parsedValue = JSON.stringify(JSON.parse(value), null, 2);
            } catch (e) {
              parsedValue = value;
            }
            formattedData += `  ${field}: ${parsedValue}\n`;
          }
          formattedData += '\n';

          // 포맷된 데이터를 파일에 기록
          writeStream.write(formattedData);
        }
      } catch (error) {
        console.error(`Failed to process key ${key}:`, error);
      }
    }

    console.log(`Data has been backed up to ${backupFile}`);

    // Redis 데이터베이스를 비움 (선택사항)
    await redis.flushall();
    console.log('Redis database has been flushed.');

  } catch (error) {
    console.error('Error during backup:', error);
  } finally {
    // 파일 및 Redis 연결 종료
    writeStream.end();
    redis.disconnect();
  }
}

const everyOneMin = '*/10 * * * * *'
const everyMidNight = '59 23 * * *'

cron.schedule(process.env.NODE_ENV === "dev"
  ? everyOneMin
  : everyMidNight,
  () => {
    console.log("Cron started: ", new Date().toLocaleString())
    backupAndFlushBullMQData();
  }, {
  scheduled: true,
  timezone: 'Asia/Seoul'
});


const curDateFileNameFormat = () => {
  const now = new Date();
  // const formattedDate = now.toISOString().slice(0, 16).replace(/:/g, '-').replace('T', '-');
  // // Format the date and time in yyyy-mm-dd:hh-mm format
  const formattedDate = now.toISOString().slice(0, 16).replace('T', ':');
  return formattedDate
}


app.listen(4000, () => {
  console.log('Batch Server is running on port 4000');
});
