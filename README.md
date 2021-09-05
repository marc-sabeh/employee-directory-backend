# Postlight Task Backend

Here is the task asked of me for Postlight company <br>
All tech stacks asked in the description are used
##Start the app

The backend tech stack is:
Nodejs 
expressjs 
mongodb

# install dependencies
```bash
$ npm install
```

When the done run 
```bash
$ nodemon start
```


Now that the application is running you can open it on localhost:3000

<hr>
## For the apis

### User Crud


```bash
# Get all users
Get http://localhost:3000/users?filterBy=location&filterByValue=Beirut&limit=2&skip=1

#you can filter by any of the user's fields and then add the value needed and also you can paginate the result 
```

```bash
# will insert a new user to the db 
Post http://localhost:3000/users/signup

Payload:
email:sam22e41i@hotmail.com
name:sami sabeh
password:123456
phone_number:71262782
seiority:junior
title:Marketing manager
department_name:marketing
location:Beirut
picture: upload file

# if you want to add an image it the request body should be sent as form data and not json object to be able to upload the image 
```

```bash
# will login the user
Post http://localhost:3000/users/login

Payload:{
    "email" : "sabehmarc@outlook.com",
    "password": "12345678"
}

#The login and the sign up will give back the token and some user data for use in frontend 
```

```bash
# will delete a user from their id
Delete http://localhost:3000/users/:userId
```


```bash
# Get single user data from their token as a header an Authorization Bearer token 
Get http://localhost:3000/users/me

```


```bash
# you can also get user by id
Get http://localhost:3000/users/:userId
```


<hr>

### Department Crud


```bash
# Get all Departments
Get http://localhost:3000/departments
```

```bash
# will insert a new department to the db 
Post http://localhost:3000/departments

Payload:{
    "department_name": "Tech",
}
```
<hr>

##Unit Testing

Unit testing are done in the test folder for some methods but not all as I needed more time to do all <br>
Using supertest and jest

<br>
Thank you for your time!