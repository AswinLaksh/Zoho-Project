# Zoho-Project
A Dynamic Form Creator Website

How to start the project

First run this command

`npm install`

then run this command

`nodemon start`

The project will be running on:

`http://localhost:3000/`

#The JSON Schema formats for input

Example input:

`{
    "title": "New Form",
    "description": "This form is for checking purposes",
    "type":"object",
    "properties": {
        "name": {
            "type":"string",
            "title":"Your Full Name",
            "minLength":5,
            "maxLength": 20
        },
        "email" :{
            "type":"string",
            "format": "email",
            "title": "Email"
        },
        "phoneNumber":{
          "format": "mobile-number",
          "type":"string"
          "title":"Mobile Number"
        },
        "password":{
          "type":"string",
          "format":"password",
          "title" : "password"
        }
        //for type string, formats available are: date-time , date , time , image , video , file 
        "favouriteNumber":{
            "type":"number",
            "title": "Favourite Number",
            "minimum": 20,
            "maximum": 100
        },
        "opinion":{
            "type":"string", //default type:string
            "title": "My opinion"
        },
        "gender": {
            "type": "string",
            "title": "Gender",
            "enum": ["Male", "Female", "Other"]
        },
        "hobbies":{
            "type":"array",
            "title": "Hobbies",
            "items": {
              "type":"string",
              "enum": ["Reading","Drawing","Painting"]
            }
        },
        "resume":{
            "type":"sting",
            "title" : "Your resume",
            "format":"file",
            "extension":".pdf"
        }
    }
}`

