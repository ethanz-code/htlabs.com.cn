const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ========== 配置项（部署时通过环境变量覆盖） ==========
const CONFIG = {
  ZEPTOMAIL_API_KEY: process.env.ZEPTOMAIL_API_KEY || '', // 必须通过环境变量设置
  FROM_ADDRESS: process.env.FROM_ADDRESS || 'noreply@itcox.cn',
  FROM_NAME: process.env.FROM_NAME || 'HTLabs',
  TO_ADDRESS: process.env.TO_ADDRESS || 'service@htlabs.com.cn',
};

// ========== 发送邮件 ==========
function sendEmail(name, phone, company, desc) {
  return new Promise((resolve, reject) => {
    const htmlbody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media only screen and (max-width: 480px) {
            .email-container { width: 100% !important; padding: 12px !important; }
            .email-table td { padding: 6px 8px !important; font-size: 13px !important; }
            .email-title { font-size: 18px !important; margin-bottom: 16px !important; }
            .email-footer { font-size: 11px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: #f3f4f6;">
        <div class="email-container" style="font-family: 'Microsoft YaHei', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 8px;">
          <h2 class="email-title" style="color: #1a56db; margin: 0 0 24px 0; font-size: 22px;">新咨询 - HTLabs</h2>
          <table class="email-table" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; font-weight: bold; width: 80px; font-size: 14px;">姓名</td>
              <td style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; font-weight: bold; font-size: 14px;">电话</td>
              <td style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; font-size: 14px;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; font-weight: bold; font-size: 14px;">公司</td>
              <td style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; font-size: 14px;">${company || '未填写'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; font-weight: bold; font-size: 14px;">需求</td>
              <td style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; font-size: 14px;">${desc}</td>
            </tr>
          </table>
          <p class="email-footer" style="color: #6b7280; font-size: 12px; margin: 24px 0 0 0;">此邮件由 HTLabs 官网联系表单自动发送</p>
        </div>
      </body>
      </html>
    `;

    const data = JSON.stringify({
      from: { address: CONFIG.FROM_ADDRESS, name: CONFIG.FROM_NAME },
      to: [{ email_address: { address: CONFIG.TO_ADDRESS, name: name } }],
      subject: `新咨询 - ${name}${company ? '（' + company + '）' : ''}`,
      htmlbody: htmlbody,
    });

    const options = {
      hostname: 'api.zeptomail.com.cn',
      port: 443,
      path: '/v1.1/email',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Zoho-enczapikey ${CONFIG.ZEPTOMAIL_API_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Zeptomail API error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ========== 路由 ==========

// CORS 中间件
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// 健康检查
app.get('/*', (req, res) => {
  res.send('HTLabs Contact API');
});

// 提交表单
app.post('/*', async (req, res) => {
  try {
    const { name, phone, company, desc } = req.body;

    if (!name || !phone || !desc) {
      return res.status(400).json({ error: '缺少必填字段' });
    }

    await sendEmail(name, phone, company, desc);

    res.json({ success: true, message: '提交成功' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: '发送失败，请稍后重试' });
  }
});

const port = 9000;
app.listen(port, () => {
  console.log(`HTLabs Contact API listening on port ${port}`);
});
