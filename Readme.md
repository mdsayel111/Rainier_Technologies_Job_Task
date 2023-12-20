
# How to use
## Data must be valid JSON
## Signup API
You need to Signup with your email, password and role, like this:

```
    {
    "email": "mdsayel111@gmail.com",
    "password": "sayel111",
    "role": "admin or user"
    }
```
You need to send this JSON in the req body. Then you get a token in the cookie by res. You will need to use this token for other requests...

## Login
You can login with email and password, like this: 
```
    {
    "email": "mdsayel111@gmail.com",
    "password": "sayel111",
    }
```
Here too You also need to send this JSON in the req body. Then you get a token in the cookie by res. You will need to use this token for other requests...

## Admin API
to use admin API you need a user with role admin. If you don't have any user with admin role, You can creat a user by using singup API. You need to follow signup steps and Data will be like this:
```
    {
    "email": "mdsayel111@gmail.com",
    "password": "sayel111",
    "role": "admin"
    }
```
## Other API
You must use the token you got when you singup or login. You need to send token by cookie and you can use API with GET, POST, PATCH, DELETE method...

## Live API
https://rainier-technologies-job-task.vercel.app/api/v1/signup \
https://rainier-technologies-job-task.vercel.app/api/v1/login \
https://rainier-technologies-job-task.vercel.app/api/v1/course \
https://rainier-technologies-job-task.vercel.app/api/v1/course/:id \
https://rainier-technologies-job-task.vercel.app/api/v1/admin/course \
https://rainier-technologies-job-task.vercel.app/api/v1/admin/course/:id \
https://rainier-technologies-job-task.vercel.app/api/v1/admin/course/:id