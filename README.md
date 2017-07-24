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
```
[  
   {  
      "Target":{  
         "Id":"i-019ebfaf92631c228",
         "Port":3000
      },
      "HealthCheckPort":"3000",
      "TargetHealth":{  
         "State":"healthy"
      }
   },
   {  
      "Target":{  
         "Id":"i-0b314f9c31a99621c",
         "Port":3000
      },
      "HealthCheckPort":"3000",
      "TargetHealth":{  
         "State":"healthy"
      }
   }
]
```

## Deregister Target

### Request with instance-id
```
DELETE: /:target-group-arn/:instanceId
DELETE: /:target-group-arn/:instanceId/:port
```

### Request with Body
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
```

### Response
```
{  
  "ResponseMetadata":{  
    "RequestId":"acb95a89-70a6-11e7-a0f8-292596ece318"
  }
}
```

## Register Target with instance-id
```
POST: /:target-group-arn/:instanceId
POST: /:target-group-arn/:instanceId/:port
```

## Register Target with body
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