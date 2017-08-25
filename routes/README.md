# API Specification

## Users
Uses the subroute `/api/users`

* `GET /`: Basic user info for initialization, identified by token.
```
user: {
  _id
  name
  email
  university
  unread
  read
  urgent
  requests
}
```
* `GET /admin`: Returns an array of the admins of the page by name and email.
```
[
  user: {
    name
    email
  }
]
```
* `GET /competitions`: Returns an array of the competitions for which the user is a member or a director.
```
[
  {
    membershipStatus
    competition
  }
]
```
* `GET /director`: Returns an array of the competitions for which the user is a director.
```
[
  competition
]
```

