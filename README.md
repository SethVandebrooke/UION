# UION (User Interface Object Notation)

UION is a constructor and syntax for defining, styling, rendering and maintaining user interfaces. 

## Contents
- [Getting Started](#getting-started)
- [Constructor Documentation](#constructor-documentation)
  - [Using The Constructor](#using-the-constructor)
  - [Constructor Methods](#constructor-methods)
  - [UION Syntax](#uion-syntax)
  - [Component Parameters](#component-parameters)
- [Style Documentation](#style-documentation)
  - [Style Methods](#style-methods)
  - [Style Variables](#style-variables)
  
## Getting Started

Start by including UION.js
```html
<script src="path/to/UION.js"></script>
```

Then construct your UI object:

```js
var myui = new UI("myUIname");
```

Now you can render html and 

Here is an example utilizing nearly all of the UION functionality:

```html
<!-- at the bottom of the body -->
<script src="path/to/UION.js"></script>
<script>
  var myui = new UI("myUIName", // Give it a name
  { // Define components
    title : [ { COMPONENT : "h1", text : "$message" } ]
  }, { // Define your UI css style
    ".title" : {
      "color" : "$primary",
      "font-size" : "50pt"
    }
  }, { // Declare variables for your UI style
    primary : "#0000aa"
  });
  myui.build([
    { COMPONENT : "title", message : "Greetings!"}
  ]);
</script>
```

UION also comes with built in AJAX methods that it attaches to the global window object, which can be used like so:

```html
<!-- at the bottom of the body -->
<script src="path/to/UION.js"></script>
<script>
  var myui = new UI("myUIName",{
    title : [ { COMPONENT : "h1", text : "$message" } ],
    loadingButton : [ 
      { 
        COMPONENT : "button", 
        text : "$str",
        click : function (e) {
          window.AJAX.load("path/title.txt",document.querySelectorAll(".title")); 
        }
      } 
    ]
  }, {
    ".title" : {
      "color" : "$primary",
      "font-size" : "50pt"
    }
  }, {
    primary : "#0000aa"
  });
  myui.build([
    { COMPONENT : "title", message : "Greetings!"},
    { COMPONENT : "loadingButton", str : "click me!"}
  ]);
</script>
```

# Constructor Documentation

The UI constructor has 4 parameters:

```js
UI(
  NAME, //type: string
  COMPONENTS, //type: object
  STYLE, //type: object
  STYLE_VARIABLES //type: object
);
```

## Using the Constructor

```js
new UI("uiname", { // an object containing components
  componentName: [ // a component is comprised of an array of objects using UION syntax
    { // Element syntax
      COMPONENT: "name", //(component or tag name) type: string *Required
      ATTRIBUTE: "value", //type: string
      EVENT: CALBACK, //type: function
      children: [
        //nested elements
      ]
    }
  ]
}, { // An object describing css for a given component or html element
  SELECTOR : {
    PROPERTY : VALUE //type: string
  }
}, { // an object defining style variables
  variable : "value"
});
```

## Constructor Methods

Method Name | Parameters | Parameter Types | Description
----------- | ---------- | --------------- | -----------
build | components, target(optional) | array, DOM element | Appends the given components to the given target. If the target is not specified then it will look for an element with an id equal to "main". If "main" doesn't exists then it will append to the document.body
setComponent | name, component | string, array | Adds or changes a component configuration using UION syntax.

The constructor also appends a AJAX object to the global window object.

(window.AJAX.method)

Method Name | Parameters | Parameter Types | Description
----------- | ---------- | --------------- | -----------
get | url, callback | string, function | Makes an ajax GET call to the given url and runs the callback function on success with a single parameter (the call response).
post | url, callback, header, data | string, function, array or string, object | Makes an ajax POST call to the given url and runs the callback function on success with a single parameter (the call response).
load | url, element | string, DOM element | Loads html from the given file into the given DOM element.

## UION Syntax
UION syntax is very simple.
It requires one attribute ("COMPONENT") and accepts any kind of attribute/value combinations as long as the values are strings, numbers, or functions.
```js
{
  COMPONENT : "componentName",
  attribute : "value",
  event : function () {
    //reaction
  }
}
```
If an attribute's value is a function then the attribute is treated as an event. 
If the component name is not a previously defined as a UI component then the component name is treated as an HTML tagname and renders.
For example: 
```js
{
  COMPONENT : "div",
  id : "mydiv",
}
//Renders: <div id="mydiv"></div>
```

## Component Parameters

When rendering a component you can use parameters much like your component is a function.
Parameter placeholders always start with a $ sign, to indecate that it is a placeholder, which is followed by the name of the parameter.
For example, consider the following component configuration:
```js
var myui = new UI("myui", {
  titleLink : [
    {
      COMPONENT : "a",
      href : "$link",
      children : [
        {
          COMPONENT : "h1",
          text : "$title"
        }
      ]
    }
  ]
}, {
   a : {
    "text-decoration" : "none"
   }
});
```
When rendering this component with the "build" method, we can specify the $title and $link:

```js
myui.build([
  {
    COMPONENT : "titleLink",
    "link" : "google.com",
    "title" : "Check Out Google!"
  }
]);
```

# Style Documentation
The Style Constructor provides a useful, simple, and extendable css management system.

**Why?**
With the Style Constructor you can easily make realtime style changes, automate styles, and use CSS variables without having to compile anything or worry about browser support.

## Style Methods

Method Name | Parameters | Parameter Types | Description
----------- | ---------- | --------------- | -----------
generateCSS | style | object | Generates CSS from a [style syntax](#style-syntax) object.
addProperty | selector, property, value | string, string, string | Adds a property to a selector.
deleteProperty | selector, property, value | string, string, string | Deletes a property in a selector.
changeProperty | selector, property, value | string, string, string | Changes a property in a selector.
getProperty | selector, property | string, string | Returns a properties value from a given selector.
compile | none | null | compiles the current style settings and renders the changes on the screen.
currentCSS | none | none | Returns current style settings as JSON.

## Style Syntax

Style Syntax is much like plain CSS:

```js
SELECTOR : {
    PROPERTY : VALUE //type: string
  }
```

## Style Variables

Style variables are simple. When defined in the last parameter of the constructor, they can be used as a value for a style attribute by preceeding the name of the variable with a $ sign.
For example:
```js
new UI("uiname", { ... }, 
{
  ".mydiv" : {
    color : "$primary"
  }
}, {
  primary : "#ff0000"
});
```
