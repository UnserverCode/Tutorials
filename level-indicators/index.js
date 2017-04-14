var app = new Vue({
    el:"#root",
    data:{
        tank1:null,
        tank2:null
    }
});

// create Unserver client instance
var u = new Unserver("http://192.168.1.47:9000");

// subscribe to property updates
u.watchProperty('tank-levels.tank1', function(value){
    app.tank1 = value;
});

// subscribe to property updates
u.watchProperty('tank-levels.tank2', function(value){
    app.tank2 = value;
});

u.startPolling();

Vue.component('indicator', {
        props:['value'],
        template: '<div>'+
                    '<div>{{value}}</div>'+
                    '<div class="indicator" v-bind:class="id"></div>'+
                  '</div>',
        data: function () {
            return {
                chart: undefined,
                id: 'i' + new Date().getUTCMilliseconds(),
            }
        },
        mounted: function(){
            var colorNormal = "#8EA604";
            var colorLow = "#DB2B39";
            var options = {
                axisX:{
                    showGrid:false,
                    showLabel:false,
                    offset:0
                },
                axisY: {
                    showGrid: false,
                    showLabel: false,
                    offset: 0
                },
                width:'100%',
                heigth:'100%',
                high:100
            };
        this.chart = new Chartist.Bar('.indicator.'+this.id, 
            {
                labels: ['l'], series: [[0]]
            }, options).on('draw', function(data) {
                    var color = colorNormal;
                    if (data.series[0]<=20){
                        color = colorLow;
                    }
                    data.element.attr({
                        style: 'stroke-width: 100%; stroke:' + color
                    });
            });
        },
        updated: function(){
            this.chart.update({ labels:['l'], series:[[this.value]] })
        }
})
