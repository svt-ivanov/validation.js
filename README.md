validation.js
============

Lightweight javascript form validation.

## Description

My primary aim was to write down a flexible and easy-to-use javascript form validator. The tool should be understandable from programming point of view and hence easy extendable. That's why I tried to use more simplistic approach when I coded it.
The tool could be edited, e.g. change styling properties of the form fields or build upon with some new features, e.g. new validation rule methods. In this way should be seemlessly customizable and serve multiple purposes.
The validation is written in vanilla javascript and used basic module pattern. It should has support for IE 9 (including) and above versions.  

## How to use

For using it, just include the file into your web application and call public API of the validation module:

    validator.init(document.getElementById("example-form"), 
        {
            "name" : "required | alpha | min:3 | max:6",
            "message" : "required | alpha | min:3",
            "email" : "required | email",
            "phone" : "required | phone",
            "url" : "required | url",
            "ip" : "required | ip"
        }
     );

You must pass as first parameter of the validator init method the "id" of the form to be validated. The second one must be an object, key-value store, where keys are "ids" of input fields and values are strings with validation rules. The rules are separated with "|" and correspond exactly of those defined in the "validator" object in tool.        