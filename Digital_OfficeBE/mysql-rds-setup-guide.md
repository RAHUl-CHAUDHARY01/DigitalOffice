
# 🚀 MySQL AWS RDS Setup Guide for Node.js

A step-by-step guide to connect a Node.js app to a MySQL database hosted on AWS RDS.

---

## 🛠️ Step-by-Step MySQL RDS Setup Guide

### ✅ 1. Create MySQL RDS on AWS
- Choose **MySQL** engine
- Select the **Free Tier**
- Set up:
  - **DB Instance Identifier**
  - **Master Username** (e.g. `admin`)
  - **Master Password**
- Make sure **"Publicly Accessible" = Yes**
- Set a **Security Group**

---

### ✅ 2. Allow your IP to connect (Inbound rule)

Go to **EC2 > Security Groups**, find the one attached to your RDS, and edit **Inbound Rules**:

| Type        | Protocol | Port Range | Source              |
|-------------|----------|------------|---------------------|
| MySQL/Aurora | TCP      | 3306       | `your IP/32` or `0.0.0.0/0` (dev only) |

---

### ✅ 3. Login to MySQL from terminal

```bash
mysql -h your-db-host.rds.amazonaws.com -u admin -p
```

Enter your admin password when prompted.

---

### ✅ 4. Create a new database

```sql
CREATE DATABASE digitaloffice;
```

---

### ✅ 5. Create a new user (if needed)

```sql
CREATE USER 'akshat'@'%' IDENTIFIED BY 'databaseAK16';
```

> If user already exists, skip to next step.

---

### ✅ 6. Grant user access to the database

```sql
GRANT ALL PRIVILEGES ON digitaloffice.* TO 'akshat'@'%';
FLUSH PRIVILEGES;
```

---

### ✅ 7. Test connection from Node.js

#### Install MySQL client:

```bash
npm install mysql2
```

#### Create `test-db.js`:

```js
import mysql from 'mysql2/promise';

const run = async () => {
  const db = await mysql.createConnection({
    host: 'your-db-host.rds.amazonaws.com',
    user: 'akshat',
    password: 'databaseAK16',
    database: 'digitaloffice',
  });

  console.log('✅ Connected to MySQL');
  const [rows] = await db.execute('SELECT NOW() AS time');
  console.log('🕒 Time:', rows[0].time);
  await db.end();
};

run().catch(err => console.error('❌ Connection error:', err.message));
```

#### Run it:

```bash
node test-db.js
```

---

## 🏁 Done!

You’re ready to build your app with MySQL on the cloud! 🚀
