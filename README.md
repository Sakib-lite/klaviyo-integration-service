## Project setup

1. **Install dependencies**

```bash
yarn install
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

3. Generate an klaviyo api key and store the value in KLAVIYO_API_KEY
4. Set data retention day in DATA_RETENTION_DAYS

The application will be available at:

- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api/docs


## Compile and run the project

```bash
# development
$ yarn run start
