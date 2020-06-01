# Simple REST API

A simple REST API using **Node.js**


## Running Application

Use the following command to start the service
```batchfile
docker-compose build
docker-compose up
```

[Run server at localhost:3600](https://localhost:3600)

## Debugging
Once containers run, you can connect to `MongoDB` database using:
```cmd
docker exec -it simple-restapi_mongo_1 mongo
```


## Create a User Manually

#### 1. At first, we need to hash our user's password by running the following command:

```powershell
PS node .\hashPassword.js WhaleDeepDive@4354
```

A hashed password will be created which we'll be using in the next step:

> GENERATED HASHED PASSWORD
> =================================================
>
> Password:       WhaleDeepDive@4354
> Hash:           grH0cDJdUFIE5NTbaUifRg==$wejHwF+UjTRkK5+BrYkkNymtzSXg/lcv0shB8zEpRo93rM9g96GvfINkhPgRWRUteq7CiXpC4ALC41hScN+/ig==

#### 2. Attach and run `mongo` command against MongoDB container (container name: `simple-restapi_mongo_1`):

```
docker exec -it simple-restapi_mongo_1 mongo
```

#### 3. Run the following commands in the MongoDB container to create admin 
```
> use simple-restapi
switched to db simple-restapi

> db.users.insert({
  firstName: 'John',
  lastName: 'Doe',
  email: 'admin@sample.com',
  password: '4Wt/HroZKzbgDIbY54xs9Q==$s8H+UwhXqw1zZs/sXJ/jOsj6CH2Pf+MRd08KxWnwP9xEwaRQhBT4cHzTsOzIAD7S5Xc+xLbEKk0VauWWu46DLg==',
  permissionLevel: 2048
})
```

Now we can use the following email/password combination to login to the server and request some information:

```
email: 'admin@sample.com'
password: 'WhaleDeepDive@4354'
```
See [Get JWT Token](README.md#get-jwt-token)

## Get JWT Token

```powershell
PS $res = Invoke-RestMethod -Uri http://localhost:3600/v1/auth -Body (@{email='admin@sample.com';password='WhaleDeepDive@4354'}|ConvertTo-Json) -ContentType application/json -Method POST
```


## Get Data

### Get Users
```powershell
PS Invoke-RestMethod -Uri http://localhost:3600/v1/users -Headers @{"Authorization"="Bearer " + $res.accessToken}
```

### Get Tags
```powershell
PS Invoke-RestMethod -Uri http://localhost:3600/v1/tags -Headers @{"Authorization"="Bearer " + $res.accessToken} | Format-List
```


## Create Data

### Add Users
```powershell
#Replace `v1` by the version of API you want to call - e.g. v1, v2
PS Invoke-WebRequest -Uri http://localhost:3600/v1/users -Body (@{firstName='Daniel'; lastName='Grey'; email='daniel@sample.com'; phone='888-123-4567'; password='BasicPass@4354'; }|ConvertTo-Json) -ContentType application/json -Method POST
```
Note: All the users created using `/users` endpoint will have `permissionLevel = 1`.

### Add Subjects

```powershell
PS Invoke-WebRequest -Uri http://localhost:3600/v1/subjects -Body (@{ text='kind'; icon='/assets/kind.png'; tags='atitude','personal'; }|ConvertTo-Json) -ContentType application/json -Headers @{"Authorization"="Bearer " + $res.accessToken} -Method POST
```

### Add Tags
```powershell
PS Invoke-WebRequest -Uri http://localhost:3600/v1/tags/personal -Headers @{"Authorization"="Bearer " + $res.accessToken} -Method PUT
```


## Modify Data

### Modify Subjects
```powershell
PS Invoke-WebRequest -Uri http://localhost:3600/v1/subjects/5ec34ede338ad8001128154d -Body (@{ tags='5ec4ebc101e65a0011c5f853','5ec4ef9501e65a0011c5f854'; }|ConvertTo-Json) -ContentType application/json -Headers @{"Authorization"="Bearer " + $res.accessToken} -Method PATCH
```

## Hosing/Deployment - AWS EC2 Elastic Beanstalk

## Deployment

Run the following commands to build the `Docker` container and push it to the registry:
```cmd
docker-compose build

docker push cloud.canister.io:5000/babak1199/simple-restapi
```
Compress the source folder to a `.zip` archive and deploy it to `AWS` by logging in to [AWS Elastic Beanstalk console](https://console.aws.amazon.com/elasticbeanstalk)

## Connection to AWS EC2 Elastic Beanstalk

```
eb ssh
```

## Transferring Files To/From Elastic Beanstalk

```cmd
scp -i C:\Users\bakbarzadeh\.ssh\aws-eb ec2-user@54.158.109.176:/home/ec2-user/test/db/* .
```
