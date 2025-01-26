## API DOCUMENTATION
### Register User

Endpoint : POST /user/regis

Request Body :

```json
{
  "username" : "soni",
  "password" : "secret",
  "name" : "soni w"
}
```

Response Body (Success) : 
```json
{
    "username" : "soni",
    "name" : "soni w"
}
```
Response Body (Failed) :

```json
{
  "errors" : "Username already registered"
}
```
## Login User

Endpoint : POST /user/login

Request Body :

```json
{
  "username" : "soni",
  "password" : "secret"
}
```

Response Body (Success) :

```json
{
    "username" : "soni",
    "token" : "session_id_generated"
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username or password is wrong"
}
```

## Get User Data

Endpoint : POST /user/get-user

Headers : 
- Aurhorization : token

Response Body (Success) :

```json
{
    "user_id" :1,
    "username" : "soni",
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```