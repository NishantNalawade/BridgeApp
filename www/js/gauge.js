var option1 = {
	angle: -0.2, // The span of the gauge arc
	lineWidth: 0.15, // The line thickness
	radiusScale: 1, // Relative radius
	pointer: {
		length: 0.55, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	},
	limitMax: false, // If false, max value increases automatically if value > maxValue
	limitMin: false, // If true, the min value of the gauge will be fixed
	// colorStart: '#000',
	staticZones: [{
			strokeStyle: "#42A5F5",
			min: -10,
			max: 0
		}, 
		{
			strokeStyle: "#90CAF9",
			min: 0,
			max: 10
		}, 
		{
			strokeStyle: "#E3F2FD",
			min: 10,
			max: 20
		}, 
		{
			strokeStyle: "#ffe082",
			min: 20,
			max: 35
		}, 
		{
			strokeStyle: "#ffa726",
			min: 35,
			max: 50
		}, 
		{
			strokeStyle: "#ff8a65",
			min: 50,
			max: 65
		},
		{
			strokeStyle: "#ef5350",
			min: 65,
			max: 80
		},
		{
			strokeStyle: "#e00212",
			min: 80,
			max: 90
		},
		{
			strokeStyle: "#b61827",
			min: 90,
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
	lineWidth: 0.15, // The line thickness
	radiusScale: 1, // Relative radius
	pointer: {
		length: 0.55, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	},
	limitMax: false, // If false, max value increases automatically if value > maxValue
	limitMin: false, // If true, the min value of the gauge will be fixed
	staticZones: [{
		strokeStyle: "#000",
		min: -5,
		max: 0
	}, 
	{
		strokeStyle: "#fffde7",
		min: 0,
		max: 15
	}, 
	{
		strokeStyle: "#fff9c4",
		min: 15,
		max: 30
	}, 
	{
		strokeStyle: "#fff59d",
		min: 30,
		max: 45
	}, 
	{
		strokeStyle: "#fff176",
		min: 45,
		max: 60
	}, 
	{
		strokeStyle: "#ffee58",
		min: 60,
		max: 75
	},
	{
		strokeStyle: "#ffeb3b",
		min: 75,
		max: 95
	},
	{
		strokeStyle: "#fff",
		min: 95,
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
	lineWidth: 0.15, // The line thickness
	radiusScale: 1, // Relative radius
	pointer: {
		length: 0.55, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	},
	limitMax: false, // If false, max value increases automatically if value > maxValue
	limitMin: false, // If true, the min value of the gauge will be fixed
	staticZones: [
	{
		strokeStyle: "#e1f5fe",
		min: 0,
		max: 15
	}, 
	{
		strokeStyle: "#b3e5fc",
		min: 15,
		max: 30
	}, 
	{
		strokeStyle: "#81d4fa",
		min: 30,
		max: 45
	}, 
	{
		strokeStyle: "#4fc3f7",
		min: 45,
		max: 60
	}, 
	{
		strokeStyle: "#29b6f6",
		min: 60,
		max: 75
	},
	{
		strokeStyle: "#03a9f4",
		min: 75,
		max: 90
	},
	{
		strokeStyle: "#0288d1",
		min: 90,
		max: 100
	}
], // Colors
	colorStop: '#0000ff', // just experiment with them
	strokeColor: '#EEEEEE', // to see which ones work best for you
	generateGradient: true,
	highDpiSupport: true, // High resolution support

};var option4 = {
	angle: -0.2, // The span of the gauge arc
	lineWidth: 0.15, // The line thickness
	radiusScale: 1, // Relative radius
	pointer: {
		length: 0.55, // // Relative to gauge radius
		strokeWidth: 0.035, // The thickness
		color: '#000000' // Fill color
	},
	limitMax: false, // If false, max value increases automatically if value > maxValue
	limitMin: false, // If true, the min value of the gauge will be fixed
	staticZones: [	{
		strokeStyle: "#eceff1",
		min: 0,
		max: 150
	}, 
	{
		strokeStyle: "#cfd8dc",
		min: 150,
		max: 300
	}, 
	{
		strokeStyle: "#b0bec5",
		min: 300,
		max: 450
	}, 
	{
		strokeStyle: "#90a4ae",
		min: 450,
		max: 600
	}, 
	{
		strokeStyle: "#78909c",
		min: 600,
		max: 750
	},
	{
		strokeStyle: "#607d8b",
		min: 750,
		max: 900
	},
	{
		strokeStyle: "#455a64",
		min: 900,
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
lightGauge.setMinValue(-5); // Prefer setter over gauge.minValue = 0
lightGauge.animationSpeed = 32; // set animation speed (32 is default value)
lightGauge.set(10);

//humidityGauge
var humidityTarget = document.getElementById('humidityGauge'); // your canvas element
var humidityGauge = new Gauge(humidityTarget).setOptions(option3); // create sexy gauge!
humidityGauge.maxValue = 100; // set max gauge value
humidityGauge.setMinValue(0); // Prefer setter over gauge.minValue = 0
humidityGauge.animationSpeed = 32; // set animation speed (32 is default value)
humidityGauge.set(10);

//pressureGauge
var pressureTarget = document.getElementById('pressureGauge'); // your canvas element
var pressureGauge = new Gauge(pressureTarget).setOptions(option4); // create sexy gauge!
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
