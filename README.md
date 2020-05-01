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

##Running Application

Use the following command to start the service
```
docker-compose up
```

[Serving Address on port 3600](https://localhost:3600)
