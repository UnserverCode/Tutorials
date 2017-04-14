
## Introduction

This tutorial demonstrates how to create a _level indicator_ visualization integrated with Unserver:

![image](https://s3.amazonaws.com/unserver-blog-media/hmi-with-unserver-level-indicators/1.png)

The full [full code for this article](https://github.com/UnserverCode/Tutorials/blob/master/level-indicators) is available on Github.

## PLC Program API
The PLC is measuring the amounts of liquid in two tanks. 
The values of the tanks are stored as 32-bit floating point numbers at `HR200` and `HR202`.

Our HMI has to continuosly fetch and display those two values. 

## Unserver Configuration
Let's start with tag configuration.

[tags.json](https://github.com/UnserverCode/Tutorials/blob/master/level-indicators/unserver-config/tags.json):

    [
        {
            "name": "tank-levels", "device": "plc1", 
            "polling": {"enabled":true, "frequency": 2 },
            "properties": [
                { "name": "tank1", "address":"HR200", "type": "numeric", "raw": "float32" },
                { "name": "tank2", "address":"HR202", "type": "numeric", "raw": "float32" }
            ]
        }

    ]

Here we have created one tag - `tank-levels` with tho properties - `tank1` and `tank2`.

When a property is mapped as a `float32`, Unserver will read two consecutive registers to get 32 bits of data and convert them to a 32-bit floating poing number. 

For instance, to manipulate `tank1` property Unserver will use both `HR200` and `HR201`.

After modifying `tags.json` we can run Unserver and see that everything is working by calling the tag from the browser:

![Calling Unserver directly from the browser](https://s3.amazonaws.com/unserver-blog-media/hmi-with-unserver-level-indicators/2.png)

The tag's value is being returned, which means the configuration is correct.

## Web App Development

We will be using the following libraries to simplify development:

- [Vue](https://vuejs.org/) for data binding
- [purecss](https://purecss.io/) for styling
- [Chartist](https://gionkunz.github.io/chartist-js/) for graphics

### HTML

The following code creates two `indicator` components on the page, each bound to a corresponding 
property of the Vue App:

[index.html](https://github.com/UnserverCode/Tutorials/blob/master/level-indicators/index.html)

    <div class="pure-u-1-5">
        <div class="center"><h2>TANK LEVELS</h2></div>
        <div class="pure-g" id="root">
            <div class="pure-u-1-2 center">
                <indicator v-bind:value="tank1"></indicator>
                <div>Tank 1</div>
            </div>
            <div class="pure-u-1-2 center">
                <indicator v-bind:value="tank2"></indicator>
                <div>Tank 2</div>
            </div>
        <div>
    </div>

### Javascript

The Vue app is really simple - it only has two properties:

[index.js](https://github.com/UnserverCode/Tutorials/blob/master/level-indicators/index.js)

    var app = new Vue({
        el:"#root",
        data:{
            tank1:null,
            tank2:null
        }
    });

The following code creates an instance of Unserver client and subscribes to property updates:

[index.js](https://github.com/UnserverCode/Tutorials/blob/master/level-indicators/index.js)

    var u = new Unserver("http://192.168.1.47:9000");

    u.watchProperty('tank-levels.tank1', function(value){
        app.tank1 = value;
    });

    u.watchProperty('tank-levels.tank2', function(value){
        app.tank2 = value;
    });

    u.startPolling();

Every time a new property value is received, a corresponding app property is updated.

The `indicator` component found in [index.js](https://github.com/UnserverCode/Tutorials/blob/master/level-indicators/index.js) contains the code for rendering the visual representation of the value from
`app.tank1` and `app.tank2`. 

### Testing the App

We can now open `index.html` in a browser and see our live visualization.

To test that everyting is working correctly, let's try to update PLC data using Unserver API:

    u.setProperty('tank-levels.tank1', 34.5);
    u.setProperty('tank-levels.tank1', 14.2);

As you can see below, the app is responding correctly:

![image](https://s3.amazonaws.com/unserver-blog-media/hmi-with-unserver-level-indicators/3.png)


