    var currentDevice = {};
	var currentHumidity = 0;
	var currentPressure = 0;
	// SensorTag object.
	var sensortag = evothings.tisensortag.createInstance()
	var messagesSent = 0;
	var deviceCount = 0;
	var firmware;
	sensortag.lightCount = 0;
	sensortag.button1Count = 0;
	sensortag.button2Count = 0;
	sensortag.tempCount = 0;
	sensortag.humidityCount = 0;
	sensortag.accelerometerCount = 0;
	sensortag.gyroscopeCount   = 0;
	sensortag.barometerCount   = 0;
    window.humidityFinal       = 0;
    window.temperatureFinal    = 0;
    window.luxFinal            = 0;
    window.pressureFinal       = 0;
    window.magnetometerXFinal  = 0;
    window.magnetometerYFinal  = 0;
    window.magnetometerZFinal  = 0;
    window.accelerometerXFinal = 0;
    window.accelerometerYFinal = 0;
    window.accelerometerZFinal = 0;
    window.gyroscopeXFinal     = 0; 
    window.gyroscopeYFinal     = 0; 
    window.gyroscopeZFinal     = 0; 
    window.lat                 = 0;
    window.long                = 0;
	function init() {

	}

	function updateStatus() {
		console.log('updating status');
		displayValue('BridgeStatusData', 'SensorTag to HCP');
	}

        function initialiseSensorTag()
	{
		//
		// Here sensors are set up.
		//
		// If you wish to use only one or a few sensors, just set up
		// the ones you wish to use.
		//
		// First parameter to sensor function is the callback function.
		// Several of the sensors take a millisecond update interval
		// as the second parameter.
		// Gyroscope takes the axes to enable as the third parameter:
		// 1 to enable X axis only, 2 to enable Y axis only, 3 = X and Y,
		// 4 = Z only, 5 = X and Z, 6 = Y and Z, 7 = X, Y and Z.
		//
		var movementConfigVal = 60;
		sensortag
			.statusCallback(statusHandler)
			.errorCallback(errorHandler)
			.keypressCallback(keypressHandler)
			.irTemperatureCallback(irTemperatureHandler, 5000)
			.humidityCallback(humidityHandler,20000)
			.barometerCallback(barometerHandler, 50000)
			.luxometerCallback(luxometerHandler, 1000)
			.connectToClosestDevice()
        
        var options = { timeout: 30000 };
        console.log(JSON.stringify(evothings));
        console.log(JSON.stringify(device));


	}

	function statusHandler(status)
	{
		displayValue('SensorsNearbyData', 'There are ' + Object.keys(sensortag.devicesFound).length + ' sensors nearby.')
		deviceCount = 0;
		if ('Device data available' == status)
		{
			console.log('about to updatestats.  device = ' + JSON.stringify(sensortag.device));
			updateStatus();
			console.log('currentDevice = ' + JSON.stringify(currentDevice));
    		displayValue('DeviceName',currentDevice.deviceName + " connected " + currentDevice.connectionCount + " times.");
			var fw = sensortag.getFirmwareString();
			var status = sensortag.device.address + ' ' + fw;
			if (firmware < 1.2) {
				status = firmware + " You are running an old firmware version.  You can continue to use this, but please upgrade to v1.20 soon.  This can be done by using the TI app.";
				sensortag.movementCallback([accelerometerHandler,gyroscopeHandler,magnetometerHandler], 100, 254);
			} else {
                    sensortag.movementCallback([accelerometerHandler,gyroscopeHandler,magnetometerHandler], 100, 255);
			}
			displayValue('DeviceData', status)
		}
		displayValue('StatusData', status)
	}

	function errorHandler(error)
	{
		console.log('Error: ' + error)
		if ('disconnected' == error)
		{
			// Clear current values.
			var blank = '[Waiting for value]'
			displayValue('StatusData', 'Ready to connect')
			displayValue('DeviceData', '?')
			displayValue('TemperatureData', blank)
			displayValue('AccelerometerData', blank)
			displayValue('HumidityData', blank)
			displayValue('MagnetometerData', blank)
			displayValue('BarometerData', blank)
			displayValue('GyroscopeData', blank)
            displayValue('LuxometerData', blank )
			displayValue('TemperatureData1', blank)
			displayValue('AccelerometerData1', blank)
			displayValue('HumidityData1', blank)
			displayValue('MagnetometerData1', blank)
			displayValue('BarometerData1', blank)
			displayValue('GyroscopeData1', blank)
            displayValue('LuxometerData1', blank )
            

			// Reset screen color.
			setBackgroundColor('white')

			// If disconneted attempt to connect again.
			setTimeout(
				function() { sensortag.connectToClosestDevice()
					sensortag.lightCount = 0;
					sensortag.buttonCount = 0;
					sensortag.tempCount = 0;
					sensortag.humidityCount = 0;
					sensortag.accelerometerCount = 0;
					sensortag.gyroscopeCount = 0;
					sensortag.barometerCount = 0;
			},
				1000)
		}
	}

	function keypressHandler(data)
	{
		// Update background color.
		switch (data[0])
		{
			case 0:
				setBackgroundColor('white')
				break;
			case 1:
				setBackgroundColor('red')
				var string = 'Count = ' + ++sensortag.button1Count;
                window.button1CoutTotal ++;
				displayValue('Keypress1Data', string)
				break;
			case 2:
				setBackgroundColor('blue')
				var string = 'Count = ' + ++sensortag.button2Count;
				displayValue('Keypress2Data', string)
				break;
			case 3:
				setBackgroundColor('magenta')
				break;
		}

		// Update the value displayed.
		var string = 'raw: 0x' + bufferToHexStr(data, 0, 1) + ' Count = ' + ++sensortag.buttonCount;
		displayValue('KeypressData', string)
	}

	function irTemperatureHandler(data)
	{
		// Calculate temperature from raw sensor data.
		var values = sensortag.getTemperatureValues(data)
		var ac = values.ambientTemperature
//		var af = sensortag.celsiusToFahrenheit(ac)
//		var tc = values.targetTemperature
//		var tf = sensortag.celsiusToFahrenheit(tc)

		// Prepare the information to display.
        var string = ac + '&deg; C'; // Getting Current Temperature in Celsius 

		if (currentDevice.deviceName == "") {
			currentDevice.deviceName = sensortag.device.address;
			displayValue('DeviceName',currentDevice.deviceName + " connected " + currentDevice.connectionCount + " times.");
		}
		// Update the value displayed.
        window.temperatureFinal = Math.round(ac);
		displayValue('TemperatureData', string)
		displayValue('TemperatureData1', string)
	}

	function accelerometerHandler(data)
	{
		// Calculate the x,y,z accelerometer values from raw data.
		var values = sensortag.getModelTwoAccelerometerValues(data)
		var x = values.x;
		var y = values.y
		var z = values.z
        window.accelerometerXFinal = Math.round(x); //X-Axis value
        window.accelerometerYFinal = Math.round(y); //Y-Axis value
        window.accelerometerZFinal = Math.round(z); //Z-Axis value
		// Prepare the information to display.
		string = ''
			+ 'x = ' + (x >= 0 ? '+' : '') + window.accelerometerXFinal + '<br/>'
			+ 'y = ' + (y >= 0 ? '+' : '') + window.accelerometerYFinal + '<br/>'
			+ 'z = ' + (z >= 0 ? '+' : '') + window.accelerometerZFinal + '<br/>'
		var v = Math.abs((x / 2048) * 100);
		// Update the value displayed.
		displayValue('AccelerometerData', string)
		displayValue('AccelerometerData1', string)
	}
	function humidityHandler(data)
	{
		// Calculate the humidity values from raw data.
		var values = sensortag.getHumidityValues(data)
		// Calculate the humidity temperature (C and F).
		var tc = values.humidityTemperature
//		var tf = sensortag.celsiusToFahrenheit(tc)

		// Calculate the relative humidity.
		var h = values.relativeHumidity
//        alert(window.humidityFinal);
		h = h < 0?h*-1:h;
        window.humidityFinal = Math.round(h.toFixed(2));
		// Prepare the information to display.
        string = (h >= 0 ? '+' : '') + h.toFixed(2) + '% RH' + '<br/>';
		// Update the value displayed.
		displayValue('HumidityData', string);
		displayValue('HumidityData1', string);
		if (h != currentHumidity) {
		}
		currentHumidity = h;
	}

	function magnetometerHandler(data)
	{
		// Calculate the magnetometer values from raw sensor data.
		var values = sensortag.getMagnetometerValues(data)
		var x = values.x
		var y = values.y
		var z = values.z
        window.magnetometerXFinal = Math.round(x);
        window.magnetometerYFinal = Math.round(y);
        window.magnetometerXZFinal = Math.round(z);

		// Prepare the information to display.
		var string =
			'x: ' + (x >= 0 ? '+' : '') + x.toFixed(1) + '&micro;T <br/>' +
			'y: ' + (y >= 0 ? '+' : '') + y.toFixed(1) + '&micro;T <br/>' +
			'z: ' + (z >= 0 ? '+' : '') + z.toFixed(1) + '&micro;T <br/>'


		// Update the value displayed.
		displayValue('MagnetometerData', string);
		displayValue('MagnetometerData1', string);

	}

	function barometerHandler(data)
	{
		// Calculate pressure from raw sensor data.
		var values = sensortag.getBarometerValues(data)
		var pressure = values.pressure.toPrecision(4)
        window.pressureFinal = pressure;
		// Prepare the information to display.
		string =
			pressure + ' mbar<br/>'

		if (pressure != currentPressure) {
		}
		currentPressure = pressure;
		// Update the value displayed.
		displayValue('BarometerData', string)
		displayValue('BarometerData1', string)
	}

	function gyroscopeHandler(data)
	{
//		console.log('gyroHandler')
		// Calculate the gyroscope values from raw sensor data.
		var values = sensortag.getModelTwoGyroscopeValues(data)
		var x = values.x
		var y = values.y
		var z = values.z
        window.gyroscopeXFinal = x; 
        window.gyroscopeYFinal = y; 
        window.gyroscopeZFinal = z; 
		// Prepare the information to display.
        
        string =
			''
			+ 'x = ' + (x >= 0 ? '+' : '') + x.toFixed(1) + '<br/>'
			+ 'y = ' + (y >= 0 ? '+' : '') + y.toFixed(1) + '<br/>'
			+ 'z = ' + (z >= 0 ? '+' : '') + z.toFixed(1) + '<br/>'

		// Update the value displayed.
		displayValue('GyroscopeData', string)
		displayValue('GyroscopeData1', string)
	}

	function luxometerHandler(data)
	{
		// Prepare the information to display.
        var string = data[1]/2 ;
		// Update the value displayed.
        window.luxFinal = (data[1]/2);
		displayValue('LuxometerData', string + " Lux" );
		displayValue('LuxometerData1', string + " Lux" );
	}

	function displayValue(elementId, value)
	{
		if (document.getElementById(elementId) !== null) {
			document.getElementById(elementId).innerHTML = value
		}
	}

	function setBackgroundColor(color)
	{
		document.documentElement.style.background = color
		document.body.style.background = color
	}

	/**
	 * Convert byte buffer to hex string.
	 * @param buffer - an Uint8Array
	 * @param offset - byte offset
	 * @param numBytes - number of bytes to read
	 * @return string with hex representation of bytes
	 */
	function bufferToHexStr(buffer, offset, numBytes)
	{
		var hex = ''
		for (var i = 0; i < numBytes; ++i)
		{
			hex += byteToHexStr(buffer[offset + i])
		}
		return hex
	}

	/**
	 * Convert byte number to hex string.
	 */
	function byteToHexStr(d)
	{
		if (d < 0) { d = 0xFF + d + 1 }
		var hex = Number(d).toString(16)
		var padding = 2
		while (hex.length < padding)
		{
			hex = '0' + hex
		}
		return hex
	}
        
        setInterval(function pushToHCP(param,value) {
            sendMessage(param,value);
            messagesSent++;
            displayValue('StatusData', "Sensor online. " + messagesSent + " messages sent.");

	},15000);
	function sendMessage(param,value) {
		var msg = '{'
            + '"NAME":"' + param + '",'
            + '"VALUE":"' + value  + '"'
            + '}';
		 var settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://gatewayservice.cfapps.eu10.hana.ondemand.com/devices/" + sensortag.device.address +"/postData",
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache"
          },
          "data": JSON.stringify({"Humidity" : window.humidityFinal, "Temperature" : window.temperatureFinal, "Luxometer" : window.luxFinal, "Pressure": window.pressureFinal, "magnetometerX" : window.magnetometerXFinal, "magnetometerY" : window.magnetometerYFinal, "magnetometerZ" : window.magnetometerZFinal,    "accelerometerX" : window.accelerometerXFinal, "accelerometerY" : window.accelerometerYFinal,  "accelerometerZ" : window.accelerometerYFinal, "gyroscopeX" : window.gyroscopeXFinal,"gyroscopeY" : window.gyroscopeYFinal, "gyroscopeZ" : window.gyroscopeZFinal, "Latitude" : window.lat , "Longitude" : window.long})
        }
         

        $.ajax(settings).success(function (response) {
          console.log(response);
//          alert("Success");
        }).error(function(response){
        alert("Disconnected \n Reconnecting...");
//             sendMessage(param,value);
//            alert("Connection Failed");
//             timeout(1000);
        
        });
    }

	function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	}
	$(document).ready(function(){
		init();
	});

	document.addEventListener(
		'deviceready',
        function() { evothings.scriptsLoaded(initialiseSensorTag) },
		false);

	function initialize() {
      var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000
   }
   
   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
   function onSuccess(position) {
      var string = 'Latitude: ' + position.coords.latitude + '</br>' + 'Longitude: ' + position.coords.longitude + '</br>';
       displayValue('LocationData', string );
      window.lat = position.coords.latitude ;
      window.long = position.coords.latitude ;
      displayValue('LocationData', string );
      displayValue('LocationData1', string );
   }

   function onError(error) {
      alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
   }
	}