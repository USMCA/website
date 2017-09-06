# Database Specification

## User
```
{ 
  name: String,
  email: String,
  password: String,
  university: String,
  admin: Boolean,
  salt: String,
  unread: [ Notification ],
  read: [ Notification ],
  urgent: [ Notification ],
  requests: [ Request ],
  created: Date,
  updated: Date,
}
```

## Competition
```
{ 
  name: String,
  short_name: String,
  website: String,
  contests: [ Contest ],
  directors: [ User ],
  secure_members: [ User ],
  members: [ User ],
  announcements: [ Notification ],
  valid: Boolean,
  created: Date,
  updated: Date
}
```

## Notification
```
{
  admin_author: Boolean,
  author: Competition,
  title: String,
  body: String,
  created: Date,
  updated: Date
}
```

## Request
```
{
  author: User,
  body: String,
  type: Enum(REQUEST, INVITE), 
  action_type: Enum(COMP, JOIN),
  competition: Competition,
  contest, Contest,
  user_type: Enum(ADMIN, DIRECTOR, CZAR, MEMBER, TEST_SOLVER),
  created: Date,
  updated: Date
}
```

## Contest
```
{
  competition: Competition,
  location: [ {
    site: String,
    address: String
  } ],
  active: Boolean,
  name: String,
  date: Date,
  tests: [ Tests ],
  requested_test_solvers: Number,
  test_solvers: [ User ],
  test_solve_deadline: Date,
  czars: [ User ],
  created: Date,
  updated: Date
}
```

## Test
```
{
  contest: Contest,
  name: String,
  num_problems: Integer,
  problems: [ Problems ],
  created: Date,
  updated: Date
}
```

## Problem
```
{
  author: User,
  statement: String,
  answer: String,
  competition: Competition,
  shared: Boolean,
  official_soln: [ Solution ],
  alternate_soln: [ Solution ],
  difficulty: Enum(1, 2, 3, 4, 5),
  upvotes: [ User ],
  views: [ User ],
  comments: [ Comment ],
  created: Date,
  updated: Date
}
```

## Comment
```
{
  author: User,
  body: String,
  issue: Boolean,
  created: Date,
  updated: Date
}
```

## Solution
```
{
  author: User,
  body: String,
  comments: [ Comment ],
  upvotes: [ User ],
  created: Date,
  updated: Date
}
```

