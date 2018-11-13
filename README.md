# Intercagram Backend

​Intercagram is a node based backend to be used with [MongoDB](https://www.mongodb.com/)

## Install

You need to copy the example env file and change as needed. 
It needs [MongoDB](https://www.mongodb.com/) to be installed en runing on your
system, also you would need node 8.12, npm 6.4 or yarn 1. 12

```bash
cp .env.example .env
yarn install 
```

## seed
You can seed the database with random data so that, there will be a test users
to follow and be followed. In order to seed you need to run 

```bash
yarn seed
```
Now you can start searching using the app.

## Usage

You can start the server with the command

```bash
yarn dev
```
### List of pubic endpoints
| Type | URL |
| --- | --- |
| POST | http://127.0.0.1:3000/signin | 
| POST | http://127.0.0.1:3000/signup |


### List of private endpoints

| Type | URL |
| --- | --- |
| GET | http://127.0.0.1:3000/api/user/me | 
| GET | http://127.0.0.1:3000/api/users |
| GET | http://127.0.0.1:3000/api/users/{id} |
| POST |http://127.0.0.1:3000/api/users|
| GET | http://127.0.0.1:3000/api/users/{id}/pics |
| POST |http://127.0.0.1:3000/api/pics/like|
| DELETE |http://127.0.0.1:3000/api/pics/unlike/{id}|
| GET | http://127.0.0.1:3000/api/pics/search/{query} |
| GET | http://127.0.0.1:3000/api/pics/feed |
| GET | http://127.0.0.1:3000/api/comments |
| GET | http://127.0.0.1:3000/api/comments/{id} |
| POST | http://127.0.0.1:3000/api/comments |
| POST | http://127.0.0.1:3000/api/comments |
| GET | http://127.0.0.1:3000/api/followers/{user_id} |
| GET | http://127.0.0.1:3000/api/following/{user_id} |
| POST | http://127.0.0.1:3000/api/follow |
| DELETE | http://127.0.0.1:3000/api/follow/{user_id} |

## Unit tests
In order to run the unit test you can do
```bash
yarn test
```


## Credits
[Carlos Alvarez](https://github.com/Alvarz)

## License

MIT
