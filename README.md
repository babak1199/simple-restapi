# Simple REST API

A simple REST API using **Node.js**


## Running Application

Use the following command to start the service
```batchfile
docker-compose build
docker-compose up
```

[Run server at localhost:3600](https://localhost:3600)


## Create a User Manually

#### 1. At first, we need to hash our user's password by running the following command:

```powershell
PS node .\createUserManually.js WhaleDeepDive@4354
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
```powersehll
> use simple-restapi
switched to db simple-restapi

> db.Users.insert({
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

## Create the First User
```powershell
PS Invoke-WebRequest -Uri http://localhost:3600/users -Body (@{firstName='John'; lastName='Doe'; email='admin@sample.com'; password='WhaleDeepDive@4354'; permissionLevel=2048}|ConvertTo-Json) -ContentType application/json -Method POST
```
Note: All the users created using `/users` endpoint will have `permissionLevel = 1`.


## Get JWT Token

```powershell
PS $res = Invoke-RestMethod -Uri http://localhost:3600/auth -Body (@{email='admin@sample.com';password='WhaleDeepDive@4354'}|ConvertTo-Json) -ContentType application/json -Method POST
```

## Use JWT Token to Get Data

```powershell
PS Invoke-RestMethod -Uri http://localhost:3600/users -Headers @{"Authorization"="bearer " + $res.accessToken}
```

