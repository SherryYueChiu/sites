var preNote = `
`;

//所有優惠券
couponsMd = `
## 兌換券特區
### 萊爾富咖啡
- 貝納頌經典曼特寧深培4°C
- code128
- 8601002600900AC596F9247FB24
- 
- 
- 
- thuxf

### 萊爾富調味奶
- 小牧好好-紅蘋果調味奶4°C
- code128
- 8601002600900FB167005EE3E12
- 
- 
- 青椒
- thuxf

### 萊爾富雪糕
- 明治紅豆煉乳雪糕
- code128
- 8601002600900AE0A4AD17D9F94
- 
- 
- 0402
- baby


## 其它折價券
`;

//所有載具
var einvoiceMd = `
### 作者的
- CODE39
- /NSDGGV9
### 性別不明關懷協會
- CODE39
- 563
### 台中基地協會
- CODE39
- 1069
`;

/*
Coupon Format:
0 -> coupon title
1 -> coupon description
2 -> format of primary code
3 -> content of primary code
[4] -> format of secondary code
[5] -> content of secondary code
[6] -> check query string in url
[7] -> prompt password
*/