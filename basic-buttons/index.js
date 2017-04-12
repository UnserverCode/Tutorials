// create client instance 
var unserver = new Unserver('http://192.168.1.47:9000');

// create Vue App
var app = new Vue({
    el:'#root',
    data: {
        isRunning: false,
    },
    methods:{
        // this method will be executed when the 'Start' button is pressed
        start: function(){
            console.log("starting...");
            unserver.setProperty('line-control.start', true, 
                function(){ 
                    console.log("line start command sent"); 
                }, 
                function(){ 
                    console.log("communication error"); 
                });
        },
        // this method will be executed when the 'Stop' button is pressed
        stop: function(){
            console.log("stopping...");
            unserver.setProperty('line-control.stop', true, 
                function(){ 
                    console.log("line stop command sent"); 
                }, 
                function(){ 
                    console.log("communication error"); 
                });
        }
    },
    // this code will run when page loads
    mounted: function(){
        var self = this;

        // start polling of watched tags
        unserver.startPolling(500);

        // watch the 'running' property of the PLC
        unserver.watchProperty('line-state.running', function(value){
            self.isRunning = value;
        });
    }
});