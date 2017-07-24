# AWS ALB Api #

# Overview #
Provide restful end-point to register/deregister targets in a ALB Target Group

# End-Points

## List Targets Health
### Request
```
GET: /:target-group-arn
```
### Response

## Deregister Target
### Request
```
POST: /:target-group-arn
Body: [
  {
    Id: "i-0b314f9c31a99621c",
    Port: "3000"
  },
  {
    Id: "i-019ebfaf92631c228"
  }
]
```

## Register Target
```
DELETE: /:target-group-arn/:instanceId
```
```
DELETE: /:target-group-arn
Body: [
  {
    Id: "i-0b314f9c31a99621c",
    Port: "3000"
  },
  {
    Id: "i-019ebfaf92631c228"
  }
]