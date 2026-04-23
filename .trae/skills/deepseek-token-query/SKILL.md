---
name: "deepseek-token-query"
description: "查询 DeepSeek 账户余额与 API 使用情况。当用户询问 DeepSeek 余额/Token用量/API状态时自动调用。"
---

# DeepSeek Token Query

用于查询 DeepSeek API 账户余额和用量情况。

## 前置条件

- 使用 `windows-cli` MCP 工具执行 `curl.exe` 命令
- API Key 存储在 `deepseek-key.json` 配置文件中

## 使用方法

### 1. 查询账户余额

向模型提供读取配置文件中的 API Key，然后执行以下请求：

```powershell
curl.exe -X GET "https://api.deepseek.com/user/balance" ^
  -H "Authorization: Bearer <从配置文件读取的 api_key>"
```

**返回示例：**
```json
{
  "is_available": true,
  "balance_infos": [
    {
      "currency": "CNY",
      "total_balance": "67.29",
      "granted_balance": "0.00",
      "topped_up_balance": "67.29"
    }
  ]
}
```

**字段说明：**
| 字段 | 说明 |
|------|------|
| `is_available` | 账户是否可用 |
| `total_balance` | 总余额（CNY） |
| `granted_balance` | 免费赠送余额 |
| `topped_up_balance` | 充值余额 |

### 2. 查询具体用量（今日/本月）

DeepSeek **未提供 REST API** 查询用量明细，需通过 Web 平台手动导出：

1. 打开 [DeepSeek 平台 → Usage 页面](https://platform.deepseek.com/usage)
2. 选择月份 → 点击 **「Export」**
3. 下载并解压 ZIP，得到两个 CSV 文件：
   - `amount` 文件 — 按 API Key 区分的用量明细（含每日数据）
   - 另一个文件 — 总费用汇总

### 3. 列出可用模型

```powershell
curl.exe -X GET "https://api.deepseek.com/models" ^
  -H "Authorization: Bearer <从配置文件读取的 api_key>"
```

## 安全注意事项

- `deepseek-key.json` 包含敏感 API Key，**不要提交到版本控制**
- 建议在 `.gitignore` 中添加 `.trae/skills/deepseek-token-query/deepseek-key.json`
- 如 Key 泄露，请立即在 [DeepSeek 平台](https://platform.deepseek.com/api-keys) 撤销并重新生成
