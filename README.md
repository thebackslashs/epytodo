# EPytodo

A Node.js API using Express, MySQL2, JWT, bcryptjs, and dotenv.

## Prerequisites

- Node.js and npm installed
- A running MySQL database

## Setup MySQL

1. Pull the mysql docker image

```bash
docker pull mysql:latest
```

2. Start the docker container

```bash
docker run --name mysql-container \
-e MYSQL_ROOT_PASSWORD=password \
 -v mysql-data:/var/lib/mysql \
 -p 3306:3306 \
 -d mysql:latest
```

3. Start a shell in the docker

```bash
docker exec -it mysql-container mysql -u root -p
```

4. Create the database and the appropirate user

```sql
CREATE DATABASE epytodo;
CREATE USER 'epytodo'@'%' IDENTIFIED BY 'superstrongpassword';
GRANT ALL PRIVILEGES ON epytodo.\* TO 'epytodo'@'%';
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/thebackslashs/epytodo.git
cd epytodo
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and configure your environment variables.

```bash
MYSQL_DATABASE=
MYSQL_HOST=
MYSQL_USER=
MYSQL_ROOT_PASSWORD=
PORT=
SECRET=
```

## Get Started

```bash
npm run start
```
