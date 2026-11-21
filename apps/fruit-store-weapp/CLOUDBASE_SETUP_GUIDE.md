# CloudBase 数据库集合设置指南

## 🎯 准备工作

### 1. 登录 CloudBase 控制台
- 访问: https://console.cloud.tencent.com/tcb
- 选择环境: `cloud1-d4gc2e7w9638ce590`
- 进入"数据库"管理页面

### 2. 需要创建的 4 个集合
1. **products** - 商品信息
2. **admins** - 管理员账户  
3. **stores** - 门店信息
4. **orders** - 订单信息（暂时可为空）

## 📋 集合设置详细步骤

### 集合 1: products（商品信息）

**创建集合:**
1. 点击"新建集合"
2. 集合名称输入: `products`
3. 权限设置: "所有用户可读，仅创建者可写"

**添加商品数据:**

**商品 1:**
```json
{
  "_id": "product_001",
  "title": "黄陂园【单人采摘套餐】1大人+外带1篮樱桃（约3斤）",
  "imageUrl": "/assets/images/logo.png",
  "price": 68,
  "originalPrice": 128,
  "soldCount": 326,
  "storeId": "store_001",
  "tags": ["采摘", "亲子"],
  "description": "单人采摘套餐，包含门票和外带樱桃",
  "validityStart": "2026-04-01",
  "validityEnd": "2026-06-30",
  "rules": ["凭票入园", "请勿践踏果树", "具体价格以实际采摘重量为准"],
  "content": [],
  "enabled": true,
  "createdAt": {
    "$date": "2026-04-30T00:00:00.000Z"
  }
}
```

**商品 2:**
```json
{
  "_id": "product_002", 
  "title": "黄陂园【亲子采摘套餐】2大1小+外带2篮樱桃（约6斤）",
  "imageUrl": "/assets/images/logo.png",
  "price": 128,
  "originalPrice": 236,
  "soldCount": 218,
  "storeId": "store_001",
  "tags": ["采摘", "亲子"],
  "description": "亲子采摘套餐，适合家庭出行",
  "validityStart": "2026-04-01",
  "validityEnd": "2026-06-30", 
  "rules": ["凭票入园", "请勿践踏果树"],
  "content": [],
  "enabled": true,
  "createdAt": {
    "$date": "2026-04-30T00:00:00.000Z"
  }
}
```

### 集合 2: admins（管理员账户）

**创建集合:**
1. 集合名称: `admins`
2. 权限: "所有用户可读，仅创建者可写"

**添加管理员账户:**
```json
{
  "_id": "admin_001",
  "username": "admin",
  "password": "<set-a-strong-password>",
  "name": "管理员", 
  "role": "admin",
  "createdAt": {
    "$date": "2026-04-30T00:00:00.000Z"
  }
}
```

### 集合 3: stores（门店信息）

**创建集合:**
1. 集合名称: `stores`
2. 权限: "所有用户可读，仅创建者可写"

**添加门店数据:**
```json
{
  "_id": "store_001",
  "name": "黄陂园采摘基地",
  "address": "武汉市黄陂区木兰山风景区",
  "latitude": 31.12345,
  "longitude": 114.12345,
  "phone": "400-888-8888",
  "imageUrl": "/assets/images/store.jpg",
  "enabled": true,
  "createdAt": {
    "$date": "2026-04-30T00:00:00.000Z"
  }
}
```

### 集合 4: orders（订单信息）

**创建集合:**
1. 集合名称: `orders`
2. 权限: "所有用户可读，仅创建者可写"
3. **暂时不需要添加数据**（订单会在用户下单时自动创建）

## 🔐 权限设置

**每个集合都要设置权限:**
1. 点击集合名称进入集合详情
2. 选择"权限设置"标签
3. 设置为: **所有用户可读，仅创建者可写**
4. 点击"确定"保存

## ✅ 验证设置

设置完成后，应该能看到:
- 4个集合都已创建
- 每个集合都有对应的数据
- 权限设置正确

此时管理员页面就可以正常使用了！

## 🚨 重要提醒

1. **不要删除示例数据** - 它们是管理员功能正常运行的基础
2. **及时备份** - 定期导出重要数据
3. **安全性** - 生产环境需要更严格的权限控制
4. **测试** - 设置完成后在小程序中测试管理员登录功能