# Environment Configuration Guide

## External Services Configuration

### 1. Aiven MySQL
1. Create a MySQL service in Aiven console.
2. Download the `ca.pem` SSL certificate.
3. Configure the `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL=mysql+pymysql://avnadmin:<PASSWORD>@<AIVEN_HOST>:<AIVEN_PORT>/defaultdb?ssl_ca=/path/to/ca.pem
   ```

### 2. Upstash Redis
1. Create a serverless Redis database in Upstash console.
2. Retrieve the `REDIS_URL` (format: `rediss://default:<TOKEN>@<HOST>:<PORT>`).
3. Set `REDIS_URL` in `.env`:
   ```env
   REDIS_URL=rediss://default:your_token@your-upstash-host.upstash.io:6379
   REDIS_TOKEN=your_token
   ```

### 3. Cloudflare R2 Storage
1. Create an R2 bucket named `christian-matrimony-media` in Cloudflare Dashboard.
2. Generate an API Token with Read & Write permissions.
3. Retrieve:
   - Account ID
   - Access Key ID
   - Secret Access Key
   - Public custom domain (optional)
4. Set in `.env`:
   ```env
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=christian-matrimony-media
   R2_PUBLIC_URL=https://media.christianmatrimony.app
   ```

### 4. Running Live Service Diagnostics

To test connectivity to live external services at any time, run:

```bash
source backend/.venv/bin/activate
python -m backend.app.utils.verify_services
```
