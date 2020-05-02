# Simple REST API

A simple REST API using **Node.js**

Create the first user by running the following command against your `MongoDB` database:

```
db.Users.insert({
  firstName: 'John',
  lastName: 'Doe',
  email: 'admin@sample.com',
  password: 'WhaleDeepDive@4354',
  permissionLevel: 2048
})
```

## Running Application

Use the following command to start the service
```
docker-compose build
docker-compose up
```

[Serving Address on port 3600](https://localhost:3600)

## Create the First User
```
PS Invoke-WebRequest -Uri http://localhost:3600/users -Body (@{firstName='John'; lastName='Doe'; email='admin@sample.com'; password='WhaleDeepDive@4354'; permissionLevel=2048}|ConvertTo-Json) -ContentType application/json -Method POST
```
Note: All the users created using `/users` endpoint will have `permissionLevel = 1`.


## Get JWT Token

```
PS $res = Invoke-RestMethod -Uri http://localhost:3600/auth -Body (@{email='admin@sample.com';password='WhaleDeepDive@4354'}|ConvertTo-Json) -ContentType application/json -Method POST
```

## Use JWT Token to Get Data

```
PS Invoke-RestMethod -Uri http://localhost:3600/users -Headers @{"Authorization"="bearer " + $res.accessToken}
```

