# Odd Job API
An API for Odd Job. The idea of Odd Job is to create a platform that will act as a median for users trying to find other users taking on small to unusual jobs which they are willing to do for quick earnings. 

##### Features as of now:
 
- User Login
- User Register
- Update User Profile
- Create Job Listing
- Delete Job Listing
- View Job Listing
- Update/Edit Job Details
- View Job Details
- Accept Jobs
 

## Getting Started

```sh
$ npm install
$ npm start
```
##### Note
If you encounter errors upon start. Reinstall the bcrypt plugin using NPM.
```sh
$ npm uninstall bcrypt
$ npm install bcrypt --save
```
##### Database
* The API was designed to work with MongoDB.
* It's using the provided Free Sandbox Cluster with Atlas admin user privileges. 
* Credentials can be changed in the source code under *nodemon.json* file.
* String URL an be changed in the source code under *app.js* //Mongo DB Connect line.

##### File Upload (Images)
* Images will be uploaded under /uploads folder in the file directory.
* The uploads folder was configured to be public and can be access directly. Example http://localhost:3000/uploads/1614262260658sampleimage.png
* Currently it will only accept *image/jpeg* and *image/png* mimeTypes. It also has a limit of 5mb per file. This can be changed under middleware/uploads folder.


##### Use Postman for testing endpoints.
* [Postman](https://www.postman.com/)

## Plugins/Dependencies
| Plugin | Description |
| ------ | ------ |
| [mongoose](https://www.npmjs.com/package/mongoose) | Object modeling tool for MongoDB |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Hash passwords  for security. |
| [body-parser](https://www.npmjs.com/package/body-parser) | Parse incoming request bodies under **req.body** property. |
| [express](https://www.npmjs.com/package/express) | Web framework for node. |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | Handles tokens for authorization.|
| [morgan](https://www.npmjs.com/package/morgan) | HTTP request logger middleware for node.js |
| [multer](https://www.npmjs.com/package/multer) | Handles multipart/form-data, mainly used for image uploads in the API.qq |


## Routes
> Url  with **:** needs the specified data from form-data or raw data. For full documentation see below. 
**Token Required**: Needs the generated token provided after login. Token persist for 4 hours and should be prefixed by Bearer being passed as Authorization in Headers.


|User | Endpoint URL | Type | Token Required |
| - | - | - | - |
| Get All Users | /user | GET | No
| Sign Up | /user/signup | POST | No
| Login/Sign In | /user/login | POST | No
| Get User Profile | /user/:userId | GET | No
| Edit User Profile | /user/:userId | PATCH | Yes
| Get User Jobs Post | user/:userId/jobsposted| GET | Yes 
| Get User Jobs Assigned  | user/:userId/jobsassigned | GET| Yes

|Jobs | Endpoint URL | Type | Token Required |
| - | - | - | - |
| Get Jobs List| /jobs | GET | No
| Create Job | /jobs | POST | Yes
| Get Job Details | /jobs/:jobId | GET | No
| Edit Job Details | /jobs/:jobId | PATCH | Yes
| Delete Job | /jobs/:jobId| POST | Yes 
| Apply/Accept Job | /jobs/:jobId/accept | PATCH | Yes

## User Routes Guide
---
### Get All Users	
Returns list of users signed up
* URL: http://localhost:3000/user
* Type: GET
* Requires Token: No
* Restricted: No

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| None |  |  |  |
###### **Sample Output**
*Status Code 200*
```
{
    "count": 2,
    "users": [
        {
            "_id": "60379caf7ab3ab274ccd8ad7",
            "email": "onin@test.com",
            "request": {
                "type": "GET",
                "url": "http://localhost:3000/user/60379caf7ab3ab274ccd8ad7"
            }
        },
        {
            "_id": "60379d457ab3ab274ccd8ad8",
            "email": "kai@test.com",
            "request": {
                "type": "GET",
                "url": "http://localhost:3000/user/60379d457ab3ab274ccd8ad8"
            }
        }
    ]
}
```
### User Signup / Create User
Create a new user using email and password
* URL: http://localhost:3000/user/signup
* Type: POST
* Requires Token: No
* Restricted: No

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| email | String |  Should be in email format or it will return an error. | Yes |
| password | String | Password is being hashed using bcrypt for security. |  Yes |
| name | String | Any string  | Yes | 
###### **Parameter Input**
In POSTMAN input the data using Body raw with JSON format.
```
{
    "email": "onin@test.com",
    "password": "pass",
    "name": "onin"
}
```
###### **Sample Output**
*Status Code 201*
```
{
    "message": "User Created",
    "request": {
        "type": "POST",
        "url": "http://localhost:3000/user/login"
    }
}
```
### User Login / Sign In
Login existing users using email and password
* URL: http://localhost:3000/user/login
* Type: POST
* Requires Token: No
* Restricted: No

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| email | String |  Should be in email format or it will return an error. | Yes |
| password | String | Password is being hashed using bcrypt for security. |  Yes |

###### **Parameter Input**
In POSTMAN input the data using Body raw with JSON format.
```
{
    "email": "kai@test.com",
    "password": "pass"
}
```
###### **Sample Output**
*Status Code 200*
* Token is generated for authentication to access restricted routes. 
* Token will expire in 4 hours. 
* Token should be prefixed with "Bearer" property in Authorization headers.
```
{
    "message": "Auth successful!",
    "userId": "6037a0757ab3ab274ccd8ad9",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VySWQiOiI2MDM3YTA3NTdhYjNhYjI3NGNjZDhhZDkiLCJpYXQiOjE2MTQyNTk2NTIsImV4cCI6MTYxNDI3NDA1Mn0.AIjRTwVsCvBskpHO2HPLyfLUrXoOBHepqAb6WNrgd4E"
}
```
### Get User Profile
Returns user profile data. 
":userId" can be retrieved by "user/login" or "/user" endpoint.
* URL Template: http://localhost:3000/user/:userId
* URL: http://localhost:3000/user/60379caf7ab3ab274ccd8ad7
* Type: GET
* Requires Token: No
* Restricted: No

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Type | Description | Required |
| - | - | - | - |
| None | 


###### **Sample Output**
*Status Code 200*
```
{
    "name": "onin",
    "email": "onin@test.com"
}
```
### Edit/Update User Profile
Edit user profile data for authorized users.
":userId" can be retrieved by "user/login" or "/user" endpoint.
* URL Template: http://localhost:3000/user/:userId
* URL: http://localhost:3000/user/60379caf7ab3ab274ccd8ad7
* Type: PATCH
* Requires Token: YES
* Restricted: YES

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| name | String |  Update user's name | Yes |

###### **Parameter Input**
In POSTMAN input the data using Body raw with JSON format.
```
{
    "name": "Hehe Test"
} 
```
###### **Sample Output**
*Status Code 200*
```
{
    "message": "Updated successfully",
    "request": {
        "type": "GET",
        "url": "http://localhost:3000/user/6037a0757ab3ab274ccd8ad9"
    }
}
```
### Get User's Job Post
Will return the jobs created/posted by the authorized user.
":userId" can be retrieved by "user/login" or "/user" endpoint.
* URL Template: http://localhost:3000/user/:userId/jobsposted	
* URL: http://localhost:3000/user/60379caf7ab3ab274ccd8ad7/jobsposted	
* Type: GET
* Requires Token: YES
* Restricted: YES

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| None |

###### **Sample Output**
*Status Code 200*
```
{
    "jobs": [
        {
            "_id": "6037aff48d7b20396263523a",
            "title": "Labada Express",
            "description": "3 ka kilo ang labhunon",
            "author": {
                "_id": "60379caf7ab3ab274ccd8ad7",
                "email": "onin@test.com",
                "name": "onin"
            },
            "request": {
                "type": "GET",
                "url": "http://localhost:3000/jobs/6037aff48d7b20396263523a"
            }
        }
    ]
}
```
### Get User's Assigned/Accepted Jobs
Will return the jobs created/posted by the authorized user.
":userId" can be retrieved by "user/login" or "/user" endpoint.
* URL Template: http://localhost:3000/user/:userId/jobsassigned	
* URL: http://localhost:3000/user/60379caf7ab3ab274ccd8ad7/jobsassigned	
* Type: GET
* Requires Token: YES
* Restricted: YES

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| None |

###### **Sample Output**
*Status Code 200*
```
{
    "jobs": [
        {
            "_id": "6037aff48d7b20396263523a",
            "title": "Labada Express",
            "description": "3 ka kilo ang labhunon",
            "author": {
                "_id": "60379caf7ab3ab274ccd8ad7",
                "email": "onin@test.com",
                "name": "onin"
            },
            "assigned": {
                "_id": "60379d457ab3ab274ccd8ad8",
                "email": "kai@test.com",
                "name": "kai"
            },
            "request": {
                "type": "GET",
                "url": "http://localhost:3000/jobs/6037aff48d7b20396263523a"
            }
        }
    ]
}
```
## Jobs Routes Guide
---
### Get Jobs List
Returns list of jobs user's created/posted.
* URL: http://localhost:3000/jobs
* Type: GET
* Requires Token: No
* Restricted: No

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| None |  |  |  |
###### **Sample Output**
*Status Code 200*
```
{
    "count": 1,
    "jobs": [
        {
            "_id": "6037aff48d7b20396263523a",
            "title": "Labada Express",
            "description": "3 ka kilo ang labhunon",
            "image": "uploads/1614262260658sampleimage.png",
            "author": {
                "_id": "60379caf7ab3ab274ccd8ad7",
                "email": "onin@test.com",
                "name": "onin"
            },
            "request": {
                "type": "GET",
                "url": "http://localhost:3000/jobs/6037aff48d7b20396263523a"
            }
        }
    ]
}
```
### Create/Post Job
Returns list of jobs user's created/posted.
* URL: http://localhost:3000/jobs
* Type: POST
* Requires Token: YES
* Restricted: No

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| title | String |  Job title, accepts any kind of string.  | Yes |
| description | String | Job description, accepts any kind of string.  |  Yes |
| image | String | This should be file image (PNG/JPEG) format, with less than 5mb size. In postman the field input can be changed from text to file.  | Yes | 
| requirements | String | Job requirements, accepts any kind of string.  | Yes | 
| stipend | Number | Job salary/wage, accepts number. No currency format.  | Yes | 
###### **Parameter Input**
In POSTMAN input the data using Body form-data. 
Data below would be the raw sample output of the form-data input.
```
[{"key":"title","value":"Drayber/Pakyaw padung bantayan","description":"","type":"text","enabled":true},{"key":"description","value":"Need drayber nga naay sakyanan. 5 passengers ra. Kami ra bayad gasolina.","description":"","type":"text","enabled":true},{"key":"image","description":"","type":"file","enabled":true,"value":["/Users/nino/Pictures/sampleimage.png"]},{"key":"requirements","value":"5 Passengers","description":"","type":"text","enabled":true},{"key":"stipend","value":"1500","description":"","type":"text","enabled":true}]
```
###### **Sample Output**
*Status Code 201*
```
{
    "message": "Job Posted!",
    "jobDetails": {
        "_id": "6037c3698d7b20396263523b",
        "title": "Drayber/Pakyaw padung bantayan",
        "request": {
            "type": "GET",
            "url": "http://localhost:3000/jobs/6037c3698d7b20396263523b"
        }
    }
}
```
### Get Job Details
Returns a job detailed data
":jobId" can be retrieved from "jobs/" endpoint.
* URL Template: http://localhost:3000/jobs/:jobId/	
* URL: http://localhost:3000/jobs/6037c3698d7b20396263523b
* Type: GET
* Requires Token: No
* Restricted: No

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| none |
###### **Sample Output**
*Status Code 200*
```
{
    "_id": "6037c3698d7b20396263523b",
    "title": "Drayber/Pakyaw padung bantayan",
    "description": "Need drayber nga naay sakyanan. 5 passengers ra. Kami ra bayad gasolina.",
    "image": "uploads/1614267241793sampleimage.png",
    "requirements": "5 Passengers",
    "stipend": 1500,
    "author": {
        "_id": "6037a0757ab3ab274ccd8ad9",
        "email": "test@test.com",
        "name": "Hehe Test"
    }
}
```
### Edit Job Details
Edits/Update job details data   
":jobId" can be retrieved from "jobs/" endpoint.
* URL Template: http://localhost:3000/jobs/:jobId/	
* URL: http://localhost:3000/jobs/6037c3698d7b20396263523b
* Type: PATCH
* Requires Token: Yes
* Restricted: Yes

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| title | String |  Job title, accepts any kind of string.  | Yes |
| description | String | Job description, accepts any kind of string.  |  Yes |
| image | String | This should be file image (PNG/JPEG) format, with less than 5mb size. In postman the field input can be changed from text to file.  | Yes | 
| requirements | String | Job requirements, accepts any kind of string.  | Yes | 
| stipend | Number | Job salary/wage, accepts number. No currency format.  | Yes | 
###### **Parameter Input**
In POSTMAN input the data using Body form-data. 
Data below would be the raw sample output of the form-data input.
```
[{"key":"title","value":"Drayber/Pakyaw padung bantayan","description":"","type":"text","enabled":true},{"key":"description","value":"Need drayber nga naay sakyanan. 5 passengers ra. Kami ra bayad gasolina.","description":"","type":"text","enabled":true},{"key":"image","description":"","type":"file","enabled":true,"value":["/Users/nino/Pictures/sampleimage.png"]},{"key":"requirements","value":"5 Passengers","description":"","type":"text","enabled":true},{"key":"stipend","value":"1500","description":"","type":"text","enabled":true}]
```
###### **Sample Output**
*Status Code 200*
```
{
    "message": "Updated successfully",
    "request": {
        "type": "GET",
        "url": "http://localhost:3000/jobs/6037c91c8d7b20396263523c"
    }
}
```
### Delete Job
Delete/remove a job
":jobId" can be retrieved from "jobs/" endpoint.
* URL Template: http://localhost:3000/jobs/:jobId/	
* URL: http://localhost:3000/jobs/6037c3698d7b20396263523b
* Type: DELETE
* Requires Token: Yes
* Restricted: Yes

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| none |
###### **Sample Output**
*Status Code 200*
```
{
    "message": "Job Deleted!"
}
```
### Apply/Accept Job
Accepts the specified job. User will then be assigned to the job. 
If there's another user assigned to the job the current authorized user will not be able to proceed.
The current authorized user via token will be the user that will take the job.
":jobId" can be retrieved from "jobs/" endpoint.
* URL Template: http://localhost:3000/jobs/:jobId/accept	
* URL: http://localhost:3000/jobs/6037c3698d7b20396263523b/accept
* Type: POST
* Requires Token: Yes
* Restricted: Yes

>If restricted, Authenticated users can only edit/view their own profile/jobs. If the user updates other user's data using other ID, it will return an error even if the user provided his/her own authorized token.

|Parameters| Data Type | Description | Required |
| - | - | - | - |
| none |
###### **Sample Output**
*Status Code 200*
```
{
    "message": "Updated successfully",
    "request": {
        "type": "GET",
        "url": "http://localhost:3000/jobs/6037c3698d7b20396263523b"
    }
}
```
---
Niño Onril Gamboa




