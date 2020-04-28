db.createUser({
    user: 'dbuser',
    pwd: 'AdminSimplePassword',
    roles: [{
        role: 'readWrite',
        db: 'simple-restapi'
    }]
})