# 使用方法

## Docker Compose

- `docker compose up` 啟動容器
- `docker compose rm -fsv` 暫停容器，並刪除

## 從 exec 進入 MySql

- 到 Exec 輸入 `mysql -u root -p`
- 密碼 : 123456789
- 使用資料庫: `USE niu_code;`
- 顯示資料表: `SHOW TABLES;`
- 清空使用者與卡片資料表:

```sql
  SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE TABLE users;
  TRUNCATE TABLE cards;
```
