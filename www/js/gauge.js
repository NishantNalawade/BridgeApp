var option1 = {
	angle: -0.2, // The span of the gauge arc
	lineWidth: 0.2, // The line thickness
	radiusScale: 1, // Relative radius
	pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	},
	limitMax: false, // If false, max value increases automatically if value > maxValue
	limitMin: false, // If true, the min value of the gauge will be fixed
	colorStart: '#ff0000',
	staticZones: [{
			strokeStyle: "#6fadcf",
			min: -10,
			max: 0
		}, // Red from 100 to 130
		{
			strokeStyle: "#30B32D",
			min: 0,
			max: 15
		}, // Yellow
		{
			strokeStyle: "#30B32D",
			min: 15,
			max: 40
		}, // Green
		{
			strokeStyle: "#FFDD00",
			min: 40,
			max: 80
		},
		{
			strokeStyle: "#FF0000",
			min: 80,
			max: 100
		}
	], // Colors
	colorStop: '#0000ff', // just experiment with them
	strokeColor: '#EEEEEE', // to see which ones work best for you
	generateGradient: true,
	highDpiSupport: true, // High resolution support

};

var option2 = {
	angle: -0.2, // The span of the gauge arc
	lineWidth: 0.2, // The line thickness
	radiusScale: 1, // Relative radius
	pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	},
	limitMax: false, // If false, max value increases automatically if value > maxValue
	limitMin: false, // If true, the min value of the gauge will be fixed
	colorStart: '#ff0000',
	staticZones: [{
			strokeStyle: "#6fadcf",
			min: 0,
			max: 20
		}, // Red from 100 to 130
		{
			strokeStyle: "#30B32D",
			min: 20,
			max: 70
		}, // Yellow
		{
			strokeStyle: "#FFDD00",
			min: 70,
			max: 90
		}, // Green
		{
			strokeStyle: "#F03E3E",
			min: 90,
			max: 100
		}
	], // Colors
	colorStop: '#0000ff', // just experiment with them
	strokeColor: '#EEEEEE', // to see which ones work best for you
	generateGradient: true,
	highDpiSupport: true, // High resolution support

};

var option3 = {
	angle: -0.2, // The span of the gauge arc
	lineWidth: 0.2, // The line thickness
	radiusScale: 1, // Relative radius
	pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	},
	limitMax: false, // If false, max value increases automatically if value > maxValue
	limitMin: false, // If true, the min value of the gauge will be fixed
	colorStart: '#ff0000',
	staticZones: [{
			strokeStyle: "#6fadcf",
			min: 0,
			max: 300
		}, // Red from 100 to 130
		{
			strokeStyle: "#30B32D",
			min: 300,
			max: 800
		}, // Yellow
		{
			strokeStyle: "#F03E3E",
			min: 800,
			max: 1000
		}
	], // Colors
	colorStop: '#0000ff', // just experiment with them
	strokeColor: '#EEEEEE', // to see which ones work best for you
	generateGradient: true,
	highDpiSupport: true, // High resolution support

};
//tempGauge
var temptarget = document.getElementById('tempGauge'); // your canvas element
var tempGauge = new Gauge(temptarget).setOptions(option1); // create sexy gauge!
tempGauge.maxValue = 100; // set max gauge value
tempGauge.setMinValue(-10); // Prefer setter over gauge.minValue = 0
tempGauge.animationSpeed = 32; // set animation speed (32 is default value)
tempGauge.set(0); // set actual value

//lightGauge
var lightTarget = document.getElementById('lightGauge'); // your canvas element
var lightGauge = new Gauge(lightTarget).setOptions(option2); // create sexy gauge!
lightGauge.maxValue = 100; // set max gauge value
lightGauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
lightGauge.animationSpeed = 32; // set animation speed (32 is default value)
lightGauge.set(10);

//humidityGauge
var humidityTarget = document.getElementById('humidityGauge'); // your canvas element
var humidityGauge = new Gauge(humidityTarget).setOptions(option2); // create sexy gauge!
humidityGauge.maxValue = 100; // set max gauge value
humidityGauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
humidityGauge.animationSpeed = 32; // set animation speed (32 is default value)
humidityGauge.set(10);

//pressureGauge
var pressureTarget = document.getElementById('pressureGauge'); // your canvas element
var pressureGauge = new Gauge(pressureTarget).setOptions(option3); // create sexy gauge!
pressureGauge.maxValue = 1000; // set max gauge value
pressureGauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
pressureGauge.animationSpeed = 32; // set animation speed (32 is default value)
pressureGauge.set(100);


setInterval(
	function () {
	var val = Math.random() * 100;
	tempGauge.set(window.temperatureFinal);
	lightGauge.set(window.luxFinal);
	humidityGauge.set(window.humidityFinal);
	pressureGauge.set(window.pressureFinal);
}, 1000);
