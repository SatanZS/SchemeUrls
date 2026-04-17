# 手机端常见 URL Scheme 大全

> 整理时间：2026-04-16
> 说明：部分 App（尤其是国内 App）的 Scheme 会随版本更新而变化，且官方通常不对外公布，建议以实际测试为准。

---

## 一、系统级 Scheme

### 通用（iOS & Android）

| Scheme    | 用途                | 示例                                             |
| --------- | ------------------- | ------------------------------------------------ |
| `tel:`    | 拨打电话            | `tel:10086`                                      |
| `sms:`    | 发送短信            | `sms:10086?body=查询余额`                        |
| `smsto:`  | 发送短信（Android） | `smsto:10086:查询余额`                           |
| `mailto:` | 发送邮件            | `mailto:test@example.com?subject=标题&body=内容` |

### iOS 专属

| Scheme               | 用途          | 示例                                        |
| -------------------- | ------------- | ------------------------------------------- |
| `maps://`            | Apple 地图    | `maps://?q=北京故宫`                        |
| `facetime:`          | FaceTime 视频 | `facetime:user@icloud.com`                  |
| `facetime-audio:`    | FaceTime 语音 | `facetime-audio:user@icloud.com`            |
| `itms-apps://`       | App Store     | `itms-apps://itunes.apple.com/app/idXXXXXX` |
| `shortcuts://`       | 快捷指令      | `shortcuts://run-shortcut?name=指令名称`    |
| `App-Prefs:`         | 系统设置      | `App-Prefs:WIFI`、`App-Prefs:Bluetooth`     |
| `music://`           | Apple Music   | `music://`                                  |
| `photos-redirect://` | 跳转相册      | `photos-redirect://`                        |
| `calshow://`         | 跳转日历      | `calshow://`                                |

#### 常用 iOS 设置页跳转（`App-Prefs:`）

| Scheme                        | 跳转页面    |
| ----------------------------- | ----------- |
| `App-Prefs:WIFI`              | Wi-Fi 设置  |
| `App-Prefs:Bluetooth`         | 蓝牙设置    |
| `App-Prefs:NOTIFICATIONS_ID`  | 通知设置    |
| `App-Prefs:LOCATION_SERVICES` | 定位服务    |
| `App-Prefs:Privacy`           | 隐私设置    |
| `App-Prefs:General`           | 通用设置    |
| `App-Prefs:DISPLAY`           | 显示与亮度  |
| `App-Prefs:CASTLE`            | iCloud 设置 |
| `App-Prefs:DO_NOT_DISTURB`    | 勿扰模式    |

### Android 专属

| Scheme      | 用途           | 示例                                                 |
| ----------- | -------------- | ---------------------------------------------------- |
| `geo:`      | 打开地图       | `geo:39.916,116.397?q=北京`                          |
| `market://` | Google Play    | `market://details?id=com.package.name`               |
| `intent:`   | Intent 调用    | `intent://...#Intent;scheme=xxx;package=com.xxx;end` |
| `content:`  | 访问内容提供者 | `content://contacts/people/`                         |

---

## 二、国内 App Scheme

### 社交通讯

| App  | Scheme                                           | 用途             |
| ---- | ------------------------------------------------ | ---------------- |
| 微信 | `weixin://`                                      | 打开微信         |
| 微信 | `weixin://dl/scan`                               | 扫一扫           |
| 微信 | `weixin://dl/moments`                            | 朋友圈           |
| 微信 | `weixin://dl/settings`                           | 打开设置         |
| 微信 | `weixin://dl/floatbottle`                        | 漂流瓶           |
| QQ   | `mqq://`                                         | 打开 QQ          |
| QQ   | `mqq://im/chat?chat_type=wpa&uin=QQ号&version=1` | 打开与某人的会话 |
| 微博 | `sinaweibo://`                                   | 打开微博         |
| 微博 | `sinaweibo://compose`                            | 发微博           |
| 微博 | `sinaweibo://qrcode`                             | 扫一扫           |
| 钉钉 | `dingtalk://`                                    | 打开钉钉         |
| 飞书 | `lark://`                                        | 打开飞书         |

### 支付金融

| App    | Scheme                                         | 用途                     |
| ------ | ---------------------------------------------- | ------------------------ |
| 支付宝 | `alipays://`                                   | 打开支付宝（HTTPS 安全） |
| 支付宝 | `alipay://`                                    | 打开支付宝               |
| 支付宝 | `alipays://platformapi/startapp?saId=10000007` | 扫一扫                   |
| 支付宝 | `alipays://platformapi/startapp?saId=20000056` | 付款码                   |
| 支付宝 | `alipays://platformapi/startapp?saId=20000003` | 余额宝                   |
| 云闪付 | `upwallet://`                                  | 打开云闪付               |

### 短视频 / 内容

| App      | Scheme                     | 用途             |
| -------- | -------------------------- | ---------------- |
| 抖音     | `snssdk1128://`            | 打开抖音         |
| 抖音     | `douyin://`                | 打开抖音（备用） |
| 快手     | `kwai://`                  | 打开快手         |
| 哔哩哔哩 | `bilibili://`              | 打开 B 站        |
| 哔哩哔哩 | `bilibili://video/BV号`    | 打开视频         |
| 哔哩哔哩 | `bilibili://live/直播间号` | 打开直播间       |
| 小红书   | `xhsdiscover://`           | 打开小红书       |
| 优酷     | `youku://`                 | 打开优酷         |
| 爱奇艺   | `iqiyi://`                 | 打开爱奇艺       |
| 腾讯视频 | `tenvideo://`              | 打开腾讯视频     |

### 电商购物

| App    | Scheme                                                                                         | 用途       |
| ------ | ---------------------------------------------------------------------------------------------- | ---------- |
| 淘宝   | `taobao://`                                                                                    | 打开淘宝   |
| 淘宝   | `taobao://page/item?id=商品ID`                                                                 | 打开商品页 |
| 天猫   | `tmall://`                                                                                     | 打开天猫   |
| 京东   | `openapp.jdmobile://`                                                                          | 打开京东   |
| 京东   | `openapp.jdmobile://virtual?params={"category":"jump","des":"productDetail","skuId":"商品ID"}` | 打开商品页 |
| 拼多多 | `pinduoduo://`                                                                                 | 打开拼多多 |
| 美团   | `imeituan://`                                                                                  | 打开美团   |
| 饿了么 | `eleme://`                                                                                     | 打开饿了么 |
| 闲鱼   | `fleamarket://`                                                                                | 打开闲鱼   |

### 地图导航

| App                 | Scheme                                                                          | 用途         |
| ------------------- | ------------------------------------------------------------------------------- | ------------ |
| 百度地图            | `baidumap://`                                                                   | 打开百度地图 |
| 百度地图            | `baidumap://map/direction?destination=name:目的地\|latlng:lat,lng&mode=driving` | 导航到目的地 |
| 高德地图（iOS）     | `iosamap://`                                                                    | 打开高德地图 |
| 高德地图（Android） | `androidamap://`                                                                | 打开高德地图 |
| 高德地图            | `iosamap://navi?sourceApplication=xxx&lat=纬度&lon=经度&dev=0&style=2`          | 导航         |
| 腾讯地图            | `qqmap://`                                                                      | 打开腾讯地图 |
| 腾讯地图            | `qqmap://map/routeplan?type=drive&to=目的地&tocoord=lat,lng`                    | 路线规划     |
| 滴滴出行            | `diditaxi://`                                                                   | 打开滴滴出行 |

### 工具 / 其他

| App        | Scheme              | 用途           |
| ---------- | ------------------- | -------------- |
| 百度 App   | `baiduboxapp://`    | 打开百度 App   |
| 网易云音乐 | `orpheus://`        | 打开网易云音乐 |
| QQ 音乐    | `qqmusic://`        | 打开 QQ 音乐   |
| WPS        | `kingsoftoffice://` | 打开 WPS       |
| 携程       | `ctrip://`          | 打开携程       |
| 12306      | `cn.12306://`       | 打开 12306     |
| 大众点评   | `dianping://`       | 打开大众点评   |

---

## 三、国外 App Scheme

| App           | Scheme                                                 | 用途               |
| ------------- | ------------------------------------------------------ | ------------------ |
| YouTube       | `youtube://`                                           | 打开 YouTube       |
| YouTube       | `youtube://watch?v=视频ID`                             | 打开指定视频       |
| YouTube       | `vnd.youtube:视频ID`                                   | 打开视频（备用）   |
| Instagram     | `instagram://`                                         | 打开 Instagram     |
| Instagram     | `instagram://user?username=用户名`                     | 打开用户主页       |
| Instagram     | `instagram://camera`                                   | 打开相机           |
| Twitter / X   | `twitter://`                                           | 打开 Twitter/X     |
| Twitter / X   | `twitter://user?screen_name=用户名`                    | 打开用户主页       |
| Twitter / X   | `twitter://post?message=内容`                          | 发推               |
| Facebook      | `fb://`                                                | 打开 Facebook      |
| Facebook      | `fb://profile/用户ID`                                  | 打开个人主页       |
| Facebook      | `fb://page/页面ID`                                     | 打开公共主页       |
| WhatsApp      | `whatsapp://`                                          | 打开 WhatsApp      |
| WhatsApp      | `whatsapp://send?phone=手机号&text=内容`               | 发消息给指定号码   |
| Telegram      | `tg://`                                                | 打开 Telegram      |
| Telegram      | `tg://resolve?domain=用户名`                           | 打开用户 / 频道    |
| Telegram      | `tg://join?invite=邀请码`                              | 加入群组           |
| TikTok        | `snssdk1233://`                                        | 打开 TikTok        |
| Snapchat      | `snapchat://`                                          | 打开 Snapchat      |
| LinkedIn      | `linkedin://`                                          | 打开 LinkedIn      |
| LinkedIn      | `linkedin://profile/用户ID`                            | 打开个人主页       |
| Pinterest     | `pinterest://`                                         | 打开 Pinterest     |
| Reddit        | `reddit://`                                            | 打开 Reddit        |
| Reddit        | `reddit://r/子版块名`                                  | 打开子版块         |
| Spotify       | `spotify://`                                           | 打开 Spotify       |
| Spotify       | `spotify://track/曲目ID`                               | 打开歌曲           |
| Netflix       | `nflx://`                                              | 打开 Netflix       |
| Zoom          | `zoomus://`                                            | 打开 Zoom          |
| Zoom          | `zoomus://zoom.us/join?confno=会议ID`                  | 加入会议           |
| Slack         | `slack://`                                             | 打开 Slack         |
| Dropbox       | `dbapi-2://`                                           | 打开 Dropbox       |
| Google Maps   | `comgooglemaps://`                                     | 打开 Google 地图   |
| Google Maps   | `comgooglemaps://?q=搜索词`                            | 搜索地点           |
| Google Maps   | `comgooglemaps://?daddr=目的地&directionsmode=driving` | 导航               |
| Google Chrome | `googlechrome://`                                      | 用 Chrome 打开网页 |
| Gmail         | `googlegmail://`                                       | 打开 Gmail         |
| Google Drive  | `googledrive://`                                       | 打开 Google Drive  |

---

## 四、浏览器 Scheme

| 浏览器        | Scheme                                       | 用途            |
| ------------- | -------------------------------------------- | --------------- |
| Chrome（iOS） | `googlechrome://`                            | 打开普通 URL    |
| Chrome（iOS） | `googlechromes://`                           | 打开 HTTPS URL  |
| Firefox       | `firefox://`                                 | 打开 Firefox    |
| Firefox       | `firefox://open-url?url=https://example.com` | 打开指定 URL    |
| Edge          | `microsoft-edge://`                          | 打开 Edge       |
| Edge          | `microsoft-edge://https://example.com`       | 打开指定 URL    |
| Opera         | `opera://`                                   | 打开 Opera      |
| UC 浏览器     | `ucbrowser://`                               | 打开 UC 浏览器  |
| QQ 浏览器     | `mqqbrowser://link?url=https://example.com`  | 打开指定 URL    |
| 百度浏览器    | `bdbrowser://`                               | 打开百度浏览器  |
| Via           | `via://`                                     | 打开 Via 浏览器 |

---

## 五、代码示例

### iOS（Swift）

```swift
if let url = URL(string: "weixin://") {
    UIApplication.shared.open(url)
}
```

### Android（Kotlin）

```kotlin
val intent = Intent(Intent.ACTION_VIEW, Uri.parse("weixin://"))
startActivity(intent)
```

### H5 / Web 唤起 App（带降级处理）

```javascript
// App 未安装则跳转 App Store / 官网
const timer = setTimeout(() => {
  window.location.href = 'https://apps.apple.com/app/idXXXXXX'
}, 2000)

window.location.href = 'weixin://'

// App 唤起成功，页面不可见时清除定时器
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearTimeout(timer)
})
```

---

## 六、注意事项

- **iOS 9+**：需在 `Info.plist` 中声明 `LSApplicationQueriesSchemes`，才能使用 `canOpenURL:` 检测 App 是否安装。
- **Android 11+（API 30）**：需在 `AndroidManifest.xml` 中声明 `<queries>` 元素才能查询其他应用的 Scheme。
- 部分 App 的 Scheme 会随版本更新而变化，且官方通常不对外公布，以上内容仅供参考，建议以实际测试为准。
