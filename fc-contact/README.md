# HTLabs 联系表单 FC 函数

## 部署步骤

### 1. 创建阿里云函数计算

1. 登录阿里云控制台 → 函数计算 FC
2. 创建服务（如 `htlabs`）
3. 创建函数：
   - 运行时：Node.js 18
   - 处理程序：`index.handler`
   - 请求处理程序：HTTP 触发器

### 2. 配置环境变量

在函数配置 → 环境变量中添加：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `ZEPTOMAIL_API_KEY` | Zeptomail API Key | `eiwqDPhcvjk...` |
| `FROM_ADDRESS` | 发件人地址 | `noreply@gxblic.cn` |
| `FROM_NAME` | 发件人名称 | `HTLabs` |
| `TO_ADDRESS` | 收件人地址 | `service@htlabs.com.cn` |
| `TO_NAME` | 收件人名称 | `HTLabs` |

### 3. 配置 HTTP 触发器

1. 触发器类型：HTTP 触发器
2. 请求方法：POST, OPTIONS
3. 认证方式：无需认证
4. 跨域：开启

### 4. 获取触发器地址

部署后会得到类似地址：
```
https://xxxxx.cn-hangzhou.fc.aliyuncs.com/2016-08-15/pro/htlabs/contact
```

### 5. 更新前端代码

在 `js/main.js` 中替换 `FC_ENDPOINT` 变量为你的触发器地址。

## 接口说明

**请求**：
```
POST / HTTP/1.1
Content-Type: application/json

{
  "name": "张三",
  "phone": "13800138000",
  "company": "某公司",
  "desc": "需要数字化转型咨询"
}
```

**响应**：
```json
{ "success": true, "message": "提交成功" }
```
