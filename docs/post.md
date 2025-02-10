## API DOCUMENTATION
### CREATE POST 

Endpoint : POST /post/create

Headers : 
- Aurhorization : token

Request Body :

```json
{
  "title" : "Food Choice",
  "content" : "Pizza is a beloved dish enjoyed worldwide, known for its versatility and endless topping options. Whether it’s a classic Margherita, a meat lover’s delight, or a veggie-packed creation, pizza satisfies every craving. Its crispy crust, rich tomato sauce",
  "tags" : ["hobb","food","culinary","holiday"]
}
```

Response Body (Success) : 
```json
{
  "title": "Food Choice",
  "message":"Create Post Success"
},
 
```
Response Body (Failed) :

```json
{
  "errors" : "cant make post"
}
```

## GET ALL POST OR WITH FILTER

Endpoint ALL POST : POST /post
Endpoint POST WITH FILTER : POST /post?tags=hobby,holiday

Response Body (Success) :

```json
[
    {
        "post_id": 1,
        "user_id": 1,
        "title": "Food Choice",
        "content": "Pizza is a beloved dish enjoyed worldwide, known for its versatility and endless topping options. Whether it’s a classic Margherita, a meat lover’s delight, or a veggie-packed creation, pizza satisfies every craving. Its crispy crust, rich tomato sauce",
        "tags": "hobby,food,culinary,holiday",
        "created_at": "2025-01-26T02:44:52.226Z",
        "Comment": [
            {
                "comment_id": 1,
                "user_id": 2,
                "post_id": 1,
                "content": "",
                "created_at": "2025-01-26T02:59:34.076Z",
                "_count": {
                    "Like": 0
                },
                "User": {
                    "username": "eko12"
                }
            }
        ],
        "Like": [
            {
                "like_id": 1,
                "user_id": 2,
                "post_id": 1,
                "created_at": "2025-01-26T03:11:32.972Z",
                "comment_id": null,
                "User": {
                    "username": "eko12"
                }
            }
        ]
    }
]    
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

## Like or Unlike Data

Endpoint : GET /user/like-post?postid=1

Headers : 
- Aurhorization : token

Response Body  (Like Success) :

```json
{
  "message": "like post success"
}
```
Response Body  (Unlike Success) :

```json
{
  "message": "unlike post success"
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```