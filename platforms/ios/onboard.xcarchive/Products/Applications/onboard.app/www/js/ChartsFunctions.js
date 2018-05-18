//// Script for the Graphs      
//window.onload = function () {
//    "use strict";
//    var xVal = 0, xVal2 = 0, yVal = 40, yVal2 = 80, updateInterval = 300, dps = [], dps2 = []/* number of dataPoints visible at any */, dataLength = 40,dataLength2 = 40, dataLength3 = 40;
//    var dataPoints1 = [];
//    var dataPoints2 = [];
//    var dataPoints3 = [];
//    
//    
//    var chartTemp = new CanvasJS.Chart("chartTemp", {
//   
////	title: {
////		text: "Temperature",
////        fontSize
////	},
//	axisX: {
////		title: "chart updates every 3 secs",
//        includeZero: false
//	},
//	axisY:{
//		prefix: "",
//		includeZero: false
//	}, 
//    	toolTip: {
//		shared: true
//	},
////	legend: {
////		cursor:"pointer",
////		verticalAlign: "top",
////		fontSize: 22,
////		fontColor: "dimGrey",
////		itemclick : toggleDataSeries
////	},
//	data: [{ 
//		type: "spline",
//        markerSize: 0,
//		xValueType: "dateTime",
//		yValueFormatString: "$####.00",
//		xValueFormatString: "hh:mm TT",
////		showInLegend: true,
////		name: "X-Axis",
//		dataPoints: dataPoints1
//		},
//		{				
//			type: "spline",
//            markerSize: 0,
//			xValueType: "dateTime",
//			yValueFormatString: "$####.00",
////			showInLegend: true,
////			name: "Y-Axis" ,
//			dataPoints: dataPoints2
//	},
//           {type: "spline",
//		xValueType: "dateTime",
//        markerSize: 0,
//		yValueFormatString: "$####.00",
//		xValueFormatString: "hh:mm TT",
////		showInLegend: true,
////		name: "Z-Axis",
//		dataPoints: dataPoints3  }
//          ]
//    });
//    
//    
//    function toggleDataSeries(e) {
//	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
//		e.dataSeries.visible = false;
//	}
//	else {
//		e.dataSeries.visible = true;
//	}
//	chartTemp.render();
//    }
//    var yValue1 = 60; 
//    var yValue2 = 60;
//    var yValue3 = 60;
//    var time = new Date;
//    
//    function updateTemp(count) {
//	count = count || 1;
//	for (var i = 0; i < count; i++) {
//		time.setTime(time.getTime()+ updateInterval);
//
//	// adding random value and rounding it to two digits. 
//	yValue1 = Math.round(Math.random() * 100) / 10;
//	yValue2 = Math.round(Math.random() * 100) / 10;
//	yValue3 = Math.round(Math.random() * 100) / 10;
//
//	// pushing the new values
//	dataPoints1.push({
//		x: time.getTime(),
//		y: yValue1
//	});
//	dataPoints2.push({
//		x: time.getTime(),
//		y: yValue2
//	});
//    	dataPoints3.push({
//		x: time.getTime(),
//		y: yValue3
//	});
//                if (dataPoints1.length > dataLength) {
//            dataPoints1.shift();}
//                    if (dataPoints2.length > dataLength2) {
//            dataPoints2.shift();}
//                        if (dataPoints3.length > dataLength3 ) {
//            dataPoints3.shift();
//        }
//	}
//
////	// updating legend text with  updated with y Value 
////	chartTemp.options.data[0].legendText = "X-Axis" + yValue1;
////	chartTemp.options.data[1].legendText = "Y-Axis" + yValue2; 
////	chartTemp.options.data[2].legendText = "Z-Axis" + yValue2; 
//	chartTemp.render();
//}
//    updateTemp(10);	
//    setInterval(function(){updateTemp()}, updateInterval);
//
//
//    var chartHumid = new CanvasJS.Chart("chartHumid", {
//
////        animationEnabled: true,
////        axisY: {
////            includeZero: false
////
////        },
//        data: [{
//            type: "spline",
//            markerSize: 0,
//            dataPoints: dps 
//        },
//             {
//            type: "spline",
//            markerSize: 0,
//            dataPoints: dps2
//        },  
//              
//              ]
//    });
//
//    var updateHumid = function (count) {
//        count = count || 1;
//        // count is number of times loop runs to generate random dataPoints.
//        for (var j = 0; j < count; j++) {	
//            yVal = Math.random();
//            yVal2 = Math.random();
//            
//            dps.push({
//                x: xVal,
//                y: yVal
//            });
//                xVal++;
//            dps2.push({
//            x: xVal2,
//            y: yVal2
//            });
//
//            xVal2++;
//        }
//        if (dps.length > dataLength) {
//            dps.shift();
//        }if (dps2.length > dataLength2) {
//            dps2.shift();
//        }
//        chartHumid.render();
//    };
//    updateHumid(dataLength);
//    setInterval(function(){ updateHumid() }, updateInterval);
//    
//    
//    
//    var chartAccelerometer = new CanvasJS.Chart("chartAccel", {
//
//    axisY: {
//        includeZero: false
//
//    },
//    data: [{
//        type: "spline",
//        markerSize: 0,
//        dataPoints: dps 
//    }]
//    });
//    
//    var updateAccel = function (count) {
//        count = count || 1;
//        // count is number of times loop runs to generate random dataPoints.
//        for (var j = 0; j < count; j++) {	
//            yVal = window.accelerometerXFinal;
//            yVal2 = Math.random();
//
//            dps.push({
//                x: xVal,
//                y: yVal
//            });
//            xVal++;
//        }
//        if (dps.length > dataLength) {
//            dps.shift();
//        }
//        chartAccelerometer.render();
//    };
//    updateAccel(dataLength);
//    setInterval(function(){ updateAccel() }, updateInterval);
//     }