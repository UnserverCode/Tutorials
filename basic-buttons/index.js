var unserver = new Unserver('http://192.168.1.47:9000');
var app = new Vue({
    el:'#root',
    data: {
        isRunning: false,
    },
    methods:{
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
        stop: function(){
            console.log("stopping...");
            unserver.setProperty('line-control.stop', true, 
                function(){ console.log("line stop command sent"); }, 
                function(){ console.log("communication error"); });
        }
    },
    mounted: function(){
        var self = this;
        unserver.startPolling(500);
        unserver.watchProperty('line-state.running', function(value){
            self.isRunning = value;
        });
    }
});