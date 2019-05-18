# Social list
使用user API 抓取使用者資料，並以Facebook style呈現好友名單

## Features
+ 使用者可以瀏覽全部使用者名單
+ 使用者可以點及上方TAG切換瀏覽名單
+ 使用者可以搜尋特定名字
+ 使用者搜尋後，可以看到相關提示
+ 使用者可以點籍like收藏
+ 使用者點擊頭像後會跳出更詳細的人物資訊
+ 使用者點擊卡面上的icon會秀出相對應的資訊
+ 使用者可以點擊分頁

## API reference

以下是 API 的說明：

+ 主機位址
  - https://lighthouse-user-api.herokuapp.com

+ Index API
  - https://lighthouse-user-api.herokuapp.com/api/v1/users

+ Show API
  - https://lighthouse-user-api.herokuapp.com/api/v1/users/:id

`:id`需自行帶入，範圍由 1～200

每一筆使用者資料都具備以下屬性：

+ id
+ name
+ surname
+ email
+ gender
+ age
+ region
+ birthday
+ avatar - 圖片位址

## Demo
![web](http://g.recordit.co/EKbdY1sexj.gif)

## Git page
https://wowsushi.github.io/AC-training/Social-List/
