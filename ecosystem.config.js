// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "hkqa-batch", // 실행할 앱의 이름
      script: "npm",
      args: "run start",
      watch: true, // 파일 변경 모니터링, 파일 변동시 재시작
      instances: 1,
      exec_mode: "cluster",
      env: {
        "PORT": 4001,
        "NODE_ENV": "prod"
      }
    }
  ]
}
