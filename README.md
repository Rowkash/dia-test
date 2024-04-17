### Run with Docker

- Run the command:

```shell
docker compose build
docker compose up -d
# -d - to run in the background
# --build - to rebuild containers
```
### Documentation on using the API is located at the link "http://localhost:3000/api"
### Adminer for operate with db - "http://localhost:5000"

### Example .env file

```shell
PORT=3000
DATABASE_TYPE=mysql
# DATABASE_HOST=localhost # for local
DATABASE_HOST=db # for docker
DATABASE_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD=admin
MYSQL_DATABASE=dia-test
MYSQL_ROOT_PASSWORD=admin
DATABASE_SYNCHRONIZE=false
AUTH_JWT_SECRET=secret
```

Also you can rename file " env-example " in main project folder 
