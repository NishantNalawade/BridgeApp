// File: tisensortag.js

// Documentation for the TI SensorTag:
// http://processors.wiki.ti.com/index.php/SensorTag_User_Guide
// http://processors.wiki.ti.com/index.php/File:BLE_SensorTag_GATT_Server.pdf

evothings.loadScript('libs/evothings/easyble/easyble.js')
console.log('creating evothings.tisensortag')
evothings.tisensortag = {};
(function()
{
	/** @namespace
	* @author Mikael Kindborg
	* @description JavaScript library for the TI SensorTag.
	* @alias evothings.tisensortag
	*/
	var sensortag = {}

	sensortag.DEVICEINFO_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb'
	sensortag.FIRMWARE_DATA = '00002a26-0000-1000-8000-00805f9b34fb'

	sensortag.IRTEMPERATURE_SERVICE = 'f000aa00-0451-4000-b000-000000000000'
	sensortag.IRTEMPERATURE_DATA = 'f000aa01-0451-4000-b000-000000000000'
	sensortag.IRTEMPERATURE_CONFIG = 'f000aa02-0451-4000-b000-000000000000'
	// Missing in HW rev. 1.2 (FW rev. 1.5)
	sensortag.IRTEMPERATURE_PERIOD = 'f000aa03-0451-4000-b000-000000000000'
	sensortag.IRTEMPERATURE_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	// Only in SensorTag 1.
	sensortag.ACCELEROMETER_SERVICE = 'f000aa10-0451-4000-b000-000000000000'
	sensortag.ACCELEROMETER_DATA = 'f000aa11-0451-4000-b000-000000000000'
	sensortag.ACCELEROMETER_CONFIG = 'f000aa12-0451-4000-b000-000000000000'
	sensortag.ACCELEROMETER_PERIOD = 'f000aa13-0451-4000-b000-000000000000'
	sensortag.ACCELEROMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	sensortag.HUMIDITY_SERVICE = 'f000aa20-0451-4000-b000-000000000000'
	sensortag.HUMIDITY_DATA = 'f000aa21-0451-4000-b000-000000000000'
	sensortag.HUMIDITY_CONFIG = 'f000aa22-0451-4000-b000-000000000000'
	sensortag.HUMIDITY_PERIOD = 'f000aa23-0451-4000-b000-000000000000'
	sensortag.HUMIDITY_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	// Only in SensorTag 1.
	sensortag.MAGNETOMETER_SERVICE = 'f000aa30-0451-4000-b000-000000000000'
	sensortag.MAGNETOMETER_DATA = 'f000aa31-0451-4000-b000-000000000000'
	sensortag.MAGNETOMETER_CONFIG = 'f000aa32-0451-4000-b000-000000000000'
	sensortag.MAGNETOMETER_PERIOD = 'f000aa33-0451-4000-b000-000000000000'
	sensortag.MAGNETOMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	sensortag.BAROMETER_SERVICE = 'f000aa40-0451-4000-b000-000000000000'
	sensortag.BAROMETER_DATA = 'f000aa41-0451-4000-b000-000000000000'
	sensortag.BAROMETER_CONFIG = 'f000aa42-0451-4000-b000-000000000000'
	sensortag.BAROMETER_CALIBRATION = 'f000aa43-0451-4000-b000-000000000000'
	sensortag.BAROMETER_PERIOD = 'f000aa44-0451-4000-b000-000000000000'
	sensortag.BAROMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	// Only in SensorTag 1.
	sensortag.GYROSCOPE_SERVICE = 'f000aa50-0451-4000-b000-000000000000'
	sensortag.GYROSCOPE_DATA = 'f000aa51-0451-4000-b000-000000000000'
	sensortag.GYROSCOPE_CONFIG = 'f000aa52-0451-4000-b000-000000000000'
	sensortag.GYROSCOPE_PERIOD = 'f000aa53-0451-4000-b000-000000000000'
	sensortag.GYROSCOPE_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	// Only in SensorTag 2.
	sensortag.LUXOMETER_SERVICE = 'f000aa70-0451-4000-b000-000000000000'
	sensortag.LUXOMETER_DATA = 'f000aa71-0451-4000-b000-000000000000'
	sensortag.LUXOMETER_CONFIG = 'f000aa72-0451-4000-b000-000000000000'
	sensortag.LUXOMETER_PERIOD = 'f000aa73-0451-4000-b000-000000000000'
	sensortag.LUXOMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	// Only in SensorTag 2.
	sensortag.MOVEMENT_SERVICE = 'f000aa80-0451-4000-b000-000000000000'
	sensortag.MOVEMENT_DATA = 'f000aa81-0451-4000-b000-000000000000'
	sensortag.MOVEMENT_CONFIG = 'f000aa82-0451-4000-b000-000000000000'
	sensortag.MOVEMENT_PERIOD = 'f000aa83-0451-4000-b000-000000000000'
	sensortag.MOVEMENT_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	sensortag.KEYPRESS_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb'
	sensortag.KEYPRESS_DATA = '0000ffe1-0000-1000-8000-00805f9b34fb'
	sensortag.KEYPRESS_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'
		

	/**
	 * Internal. Override if needed.
	 * @private
	 */
	sensortag.deviceIsSensorTag = function(device)
	{
		return (device != null) &&
			(device.name != null) &&
			(device.name.indexOf('Sensor Tag') > -1 ||
				device.name.indexOf('SensorTag') > -1)
	}

	/**
	 * For debugging.
	 * @public
	 */
	sensortag.logServices = function(device)
	{
		// Here we simply print found services, characteristics,
		// and descriptors to the debug console in Evothings Workbench.

		// Print all services.
		for (var serviceUUID in device.__services)
		{
			var service = device.__services[serviceUUID]
			console.log('  service: ' + service.uuid)

			// Print all characteristics for service.
			for (var characteristicUUID in service.__characteristics)
			{
				var characteristic = service.__characteristics[characteristicUUID]
				console.log('	characteristic: ' + characteristic.uuid)

				// Print all descriptors for characteristic.
				for (var descriptorUUID in characteristic.__descriptors)
				{
					var descriptor = characteristic.__descriptors[descriptorUUID]
					console.log('	  descriptor: ' + descriptor.uuid)
				}
			}
		}
	}

	/**
	 * Public. Create a SensorTag instance.
	 * @returns {@link evothings.tisensortag.SensorTagInstance}
	 * @public
	 */
	sensortag.createInstance = function()
	{
		/** @namespace
		 * @alias evothings.tisensortag.SensorTagInstance
		 * @description Internal. Variable holding the sensor tag instance object.
		 * @public
		 */
		var instance = {}
		instance.devicesFound = [];

		/**
		 * Internal. Services used by the application.
		 * @instance
		 * @private
		 */
		instance.requiredServices = []

		/**
		 * Internal. Default error handler function.
		 * @instance
		 * @private
		 */
		instance.errorFun = function(error)
		{
			console.log('SensorTag error: ' + error)
		}

		/**
		 * Internal. Default status handler function.
		 * @instance
		 * @private
		 */
		instance.statusFun = function(status)
		{
			console.log('SensorTag status: ' + status)
		}

		/**
		 * Public. Set the IR temperature notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - update rate in milliseconds (min 300ms)
		 * @instance
		 * @public
		 */
		instance.irTemperatureCallback = function(fun, interval)
		{
			instance.irTemperatureFun = fun
			instance.irTemperatureConfig = [1] // on
			instance.irTemperatureInterval = Math.max(300, interval)
			instance.requiredServices.push(sensortag.IRTEMPERATURE_SERVICE)

			return instance
		}

		instance.movementCallbackOld = function(fun, interval,config)
		{
			console.log('movement callback');
			/* Keep a list of all movement sensor's callbacks, (assume each
			 * call to this function is for a different sensor)
			 */
			instance.movementFunArray = instance.movementFunArray || []
			instance.movementFunArray.push(fun)

			/* Call all of the movement service's enabled callbacks
			 * (accelerometer, gyroscope, magnetometer)
			 */
			instance.movementFun = function(data)
				{
					console.log(instance.movementFunArray);
					for (var fun in instance.movementFunArray)
						console.log(fun + '' + JSON.stringify(data))
						instance.movementFunArray[fun](data)
				}
 			
 			/* Set the config that turns on the needed sensors.
 			 * 3-axis accelerometer on: 56 (0111000)
 			 * 3-axis accelerometer + 3-axis gyro on: 63 (0111111)
 			 */
			/* JPD
			 * 3-axis gyroscope on: 56 (0111000)
			 */
			instance.movementConfig = [config, 0] // accel + gyro on
//			instance.movementConfig = [56, 0] // accel + gyro on
			instance.movementInterval = interval
			instance.requiredServices.push(sensortag.MOVEMENT_SERVICE)
			
			console.log('end movement callback');
			return instance
		}

		instance.movementCallback = function(afun, interval,config)
		{
//			console.log('movement callback');
			/* Keep a list of all movement sensor's callbacks, (assume each
			 * call to this function is for a different sensor)
			 */
			instance.movementFunArray = instance.movementFunArray || []
//			instance.movementFunArray.push(fun)
			instance.movementFunArray = afun

			/* Call all of the movement service's enabled callbacks
			 * (accelerometer, gyroscope, magnetometer)
			 */
			instance.movementFun = function(data)
				{
//					console.log('in movementFun');
					for (var fun in instance.movementFunArray) {
						instance.movementFunArray[fun](data)
					} 
				}
 			
 			/* Set the config that turns on the needed sensors.
 			 * 3-axis accelerometer on: 56 (0111000)
 			 * 3-axis accelerometer + 3-axis gyro on: 63 (0111111)
 			 */
			/* JPD
			 * 3-axis gyroscope on: 56 (0111000)
			 */
			instance.movementConfig = [config, 0] // accel + gyro on
//			instance.movementConfig = [56, 0] // accel + gyro on
			instance.movementInterval = interval
			instance.requiredServices.push(sensortag.MOVEMENT_SERVICE)
			
//			console.log('end movement callback');
			return instance
		}

		/**
		 * Public. Set the accelerometer notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - accelerometer rate in milliseconds.
		 * @instance
		 * @public
		 */
		instance.accelerometerCallback = function(fun, interval)
		{
//			console.log('accel callback');
			instance.accelerometerFun = fun
			instance.accelerometerConfig = [0] // on
			instance.accelerometerInterval = interval
			instance.requiredServices.push(sensortag.ACCELEROMETER_SERVICE)
//			console.log(JSON.stringify(fun))
			
			return instance
		}

		/**
		 * Public. Set the humidity notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - accelerometer rate in milliseconds.
		 * @instance
		 * @public
		 */
		instance.humidityCallback = function(fun)
		{
			instance.humidityFun = fun
			instance.humidityConfig = [1] // on
			instance.requiredServices.push(sensortag.HUMIDITY_SERVICE)

			return instance
		}

		/**
		 * Public. Set the magnetometer notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - magnetometer rate in milliseconds.
		 * @instance
		 * @public
		 */
		instance.magnetometerCallback = function(fun, interval)
		{
			instance.magnetometerFun = fun
			instance.magnetometerConfig = [1] // on
			instance.magnetometerInterval = interval
			instance.requiredServices.push(sensortag.MAGNETOMETER_SERVICE)

			return instance
		}

		/**
		 * Public. Set the barometer notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - barometer rate in milliseconds.
		 * @instance
		 * @public
		 */
		instance.barometerCallback = function(fun, interval)
		{
			instance.barometerFun = fun
			instance.barometerConfig = [1] // on
  			instance.barometerInterval = interval
			instance.requiredServices.push(sensortag.BAROMETER_SERVICE)

			return instance
		}

		/**
		 * Public. Set the gyroscope notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - gyroscope rate in milliseconds.
		 * @param axes - the axes to enable ((z << 2) | (y << 1) | x)
		 * Axis parameter values are:
		 * 1 = X only, 2 = Y only,
		 * 3 = X and Y, 4 = Z only,
		 * 5 = X and Z, 6 = Y and Z,
		 * 7 = X, Y and Z.
		 * @instance
		 * @public
		 */
		instance.gyroscopeCallback = function(fun, interval, axes)
		{
			instance.gyroscopeFun = fun
			instance.gyroscopeConfig = [axes]
			instance.gyroscopeInterval = interval
			instance.requiredServices.push(sensortag.GYROSCOPE_SERVICE)

			return instance
		}

		/**
		 * Public. Set the luxometer notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - luxometer rate in milliseconds.
		 */
		instance.luxometerCallback = function(fun, interval)
		{
			instance.luxometerFun = fun
			instance.luxometerConfig = [1] // on
			instance.luxometerInterval = interval
			instance.requiredServices.push(sensortag.LUXOMETER_SERVICE)

			return instance
		}

		/**
		 * Public. Set the keypress notification callback.
		 * @param fun - success callback called when a key is pressed: fun(data)
		 * @instance
		 * @public
		 */
		instance.keypressCallback = function(fun)
		{
			instance.keypressFun = fun
			instance.requiredServices.push(sensortag.KEYPRESS_SERVICE)

			return instance
		}

		/**
		 * Public. Set the error handler function.
		 * @param fun - error callback: fun(error)
		 * @instance
		 * @public
		 */
		instance.errorCallback = function(fun)
		{
			instance.errorFun = fun

			return instance
		}

		/**
		 * Public. Set the status handler function.
		 * @param fun - callback: fun(status)
		 * @instance
		 * @public
		 */
		instance.statusCallback = function(fun)
		{
			instance.statusFun = fun

			return instance
		}

		/**
		 * Public. Connect to the closest physical SensorTag device.
		 * @instance
		 * @public
		 */
		instance.connectToClosestDevice = function()
		{
			instance.statusFun && instance.statusFun('Scanning...')
			instance.disconnectDevice()
			evothings.easyble.stopScan()
			evothings.easyble.reportDeviceOnce(false)
			var stopScanTime = Date.now() + 2000
			var closestDevice = null
			var strongestRSSI = -1000
			evothings.easyble.startScan(
				function(device)
				{
					// Connect if we have found a sensor tag.
					if (sensortag.deviceIsSensorTag(device)
						&& device.rssi != 127 // Invalid RSSI value
						)
					{
						if (typeof instance.devicesFound[device.address] === 'undefined') {
							instance.devicesFound[device.address] = device;
						}
						if (device.rssi > strongestRSSI)
						{
							closestDevice = device
							strongestRSSI = device.rssi
						}

						if (Date.now() >= stopScanTime)
						{
							instance.statusFun && instance.statusFun('SensorTag found')
							evothings.easyble.stopScan()
							instance.device = closestDevice
							instance.connectToDevice()
						}
					}
				},
				function(errorCode)
				{
					instance.errorFun('Scan failed')
				})

			return instance
		}

		/**
		 * Public. Connect to the recent physical SensorTag device.
		 * JPD - 07/24 - Enhanced to handle multiple nearby devices that we 
		 * may not be interested in.
		 * @instance
		 * @public
		 */
		instance.enhancedConnectToClosestDevice = function()
		{
			instance.statusFun && instance.statusFun('Scanning...')
			instance.disconnectDevice()
			evothings.easyble.stopScan()
			evothings.easyble.reportDeviceOnce(false)
			var scanInProgress = true;
			var stopScanTime = Date.now() + 2000
			var closestDevice = null
			var strongestRSSI = -1000
			evothings.easyble.startScan(
				function(device)
				{
					// Connect if we have found a sensor tag.
					if (sensortag.deviceIsSensorTag(device)
						&& device.rssi != 127 // Invalid RSSI value
						)
					{
						if (typeof instance.devicesFound[device.address] === 'undefined') {
//							console.log(device.address);
							instance.devicesFound[device.address] = device;
						}
						if (device.rssi > strongestRSSI)
						{
							closestDevice = device
							strongestRSSI = device.rssi
						}

						if (scanInProgress && Date.now() >= stopScanTime)
						{
							scanInProgress = false;
							evothings.easyble.stopScan()
							instance.statusFun && instance.statusFun(Object.keys(instance.devicesFound).length + ' found')
							if (typeof instance.device == 'undefined') {
								instance.device = closestDevice
								console.log('connecting to the closest sensor')
							}
							instance.connectToDevice()
						}
					}
				},
				function(errorCode)
				{
					instance.errorFun('Scan failed')
				})

			return instance
		}

		/**
		 * Internal.
		 * @instance
		 * @private
		 */
		instance.connectToDevice = function()
		{
			instance.statusFun && instance.statusFun('Connecting...')
			instance.device.connect(
				function(device)
				{
					instance.statusFun && instance.statusFun('Connected')
					instance.readDeviceInfo()
				},
				instance.errorFun)
		}

		/**
		 * In the SensorTag 1, the luxometer service is missing. Remove this
		 * from the list of required services.
		 * TODO: remove the requiredServices approach and only use existing
		 * services.
		 */
		instance.handleSensorTagOne = function()
		{
			if (instance.getDeviceModel() < 2.0 &&
				-1 != (luxometerServiceIndex =
					instance.requiredServices.indexOf(
						sensortag.LUXOMETER_SERVICE)))
			{
				// Remove dependency of service non-existent in SensorTag 1.
				instance.requiredServices.splice(luxometerServiceIndex, 1)

				// Replace On-function for compatibility with SensorTag 1.
				instance.luxometerOn = function() {}
			}
		}

		/**
		 * In the SensorTag 2, the accelerometer, magnetometer and gyroscope
		 * services are replaced with the movement service. To preserve
		 * individual callbacks for these, re-route them through the movement
		 * callback.
		 */
		instance.handleSensorTagTwo = function()
		{
			if (instance.getDeviceModel() == 2.0 &&
				-1 != (magnetometerServiceIndex =
					instance.requiredServices.indexOf(
						sensortag.MAGNETOMETER_SERVICE)))
			{
				// Remove dependency of service non-existent in SensorTag 2.
				instance.requiredServices.splice(magnetometerServiceIndex, 1)

				// Replace On-function for compatibility with SensorTag 2.
				instance.magnetometerOn = function() {}
			}

			if (instance.getDeviceModel() == 2.0 &&
				-1 != (accelerometerServiceIndex =
					instance.requiredServices.indexOf(
						sensortag.ACCELEROMETER_SERVICE)))
			{
				// Remove dependency of service non-existent in SensorTag 2.
				instance.requiredServices.splice(accelerometerServiceIndex, 1)

				// Replace On-function for compatibility with SensorTag 2.
				instance.accelerometerOn = instance.movementOn
				
				/* Replace accelerometer value getter function for
				 * compatibility with SensorTag 2.
				 */
				instance.getAccelerometerValues =
					instance.getModelTwoAccelerometerValues

				// Enable the movement service callback for accelerometer.
				instance.movementCallback(
					instance.accelerometerFun,
					instance.accelerometerInterval
				)
			}

			if (instance.getDeviceModel() == 2.0 &&
				-1 != (gyroscopeServiceIndex = 
					instance.requiredServices.indexOf(
						sensortag.GYROSCOPE_SERVICE)))
			{
				// Remove dependency of service non-existent in SensorTag 2.
				instance.requiredServices.splice(gyroscopeServiceIndex, 1)

				// Replace On-function for compatibility with SensorTag 2.
				instance.gyroscopeOn = instance.movementOn
				
				/* Replace accelerometer value getter function for
				 * compatibility with SensorTag 2.
				 */
				instance.getGyroscopeValues =
					instance.getModelTwoGyroscopeValues

				// Enable the movement service callback for accelerometer.
				instance.movementCallback(
					instance.gyroscopeFun,
					instance.gyroscopeInterval
				)
			}
		}

		/**
		 * Internal. When connected we read device info. This can be
		 * used to support different firmware versions etc.
		 * For now we just read the firmware version.
		 * @instance
		 * @private
		 */
		instance.readDeviceInfo = function()
		{
			function gotDeviceInfoService(device)
			{
				instance.device.readCharacteristic(
					sensortag.FIRMWARE_DATA,
					gotFirmwareValue,
					instance.errorFun)
			}

			function gotFirmwareValue(data)
			{

				// Set firmware string. 
				var fw = evothings.ble.fromUtf8(data)
				instance.firmwareString = fw.substr(0,4)
				instance.statusFun && instance.statusFun('Device data available')

				// Continue and read services requested by the application.
				instance.statusFun && instance.statusFun('Reading services...')

				/* For the SensorTag 1, remove the non-existent luxometer and
				 * movement services.
				 * TODO: remove the requiredServices approach and only use existing
				 * services.
				 */
//				instance.handleSensorTagOne()

				/* Replace use of any accelerometer, gyroscope and magnetometer
				 * services with the movement service when having SensorTag 2.
				 */
//				instance.handleSensorTagTwo()

				instance.device.readServices(
					instance.requiredServices,
					instance.activateSensors,
					instance.errorFun)
			}

			function readDeviceInfoService()
			{
				// Read device information service.
				instance.device.readServices(
					[sensortag.DEVICEINFO_SERVICE],
					gotDeviceInfoService,
					instance.errorFun)
			}

			/* First determine the device model by looking for services unique
			 * to certain models.
			 */ 
			instance.device.readServices(
				null,
				function()
				{
					// Get an array of service UUIDs available.
					var services = instance.device.__services.map(
						function(elm) { return elm.uuid; })

					// Look for services unique to the SensorTag 2.
					if (-1 != services.indexOf(sensortag.LUXOMETER_SERVICE)  &&
						-1 != services.indexOf(sensortag.MOVEMENT_SERVICE) &&
						-1 == services.indexOf(sensortag.ACCELEROMETER_SERVICE) &&
						-1 == services.indexOf(sensortag.MAGNETOMETER_SERVICE) &&
						-1 == services.indexOf(sensortag.GYROSCOPE_SERVICE))
						instance.deviceModel = 2.0
					else
						instance.deviceModel = 1.0

					readDeviceInfoService()
				},
				instance.errorFun)
		}

		/**
		 * Public. Get device model number.
		 */
		instance.getDeviceModel = function()
		{
			return instance.deviceModel
		}

		/**
		 * Public. Get firmware string.
		 * @instance
		 */
		instance.getFirmwareString = function()
		{
			return instance.firmwareString
		}

		/**
		 * Public. Disconnect from the physical device.
		 * @instance
		 * @public
		 */
		instance.disconnectDevice = function()
		{
			if (instance.device)
			{
				instance.device.close()
				instance.device = null
			}

			return instance
		}

		/**
		 * Internal.
		 * @instance
		 * @private
		 */
		instance.activateSensors = function()
		{
			// Debug logging.
			//console.log('-------------------- SERVICES --------------------')
			//sensortag.logServices(instance.device)
			//console.log('---------------------- END -----------------------')

			instance.statusFun && instance.statusFun('Sensor online')
			instance.irTemperatureOn()
//			instance.accelerometerOn()
			instance.humidityOn()
//			instance.magnetometerOn()
			instance.barometerOn()
//			instance.gyroscopeOn()
			instance.luxometerOn()
			instance.keypressOn()
			instance.movementOn()
		}

		/**
		 * Public. Turn on IR temperature notification.
		 * @instance
		 * @public
		 */
		instance.irTemperatureOn = function()
		{
			instance.sensorOn(
				sensortag.IRTEMPERATURE_CONFIG,
				instance.irTemperatureConfig,
				sensortag.IRTEMPERATURE_PERIOD,
				instance.irTemperatureInterval,
				sensortag.IRTEMPERATURE_DATA,
				sensortag.IRTEMPERATURE_NOTIFICATION,
				instance.irTemperatureFun
			)

			return instance
		}

		/**
		 * Public. Turn off IR temperature notification.
		 * @instance
		 * @public
		 */
		instance.irTemperatureOff = function()
		{
			instance.sensorOff(sensortag.IRTEMPERATURE_DATA)

			return instance
		}


		/**
		 * Public. Turn on movement notification (SensorTag 2).
		 */
		instance.movementOn = function()
		{
			instance.sensorOn(
				sensortag.MOVEMENT_CONFIG,
				instance.movementConfig,
				sensortag.MOVEMENT_PERIOD,
				instance.movementInterval,
				sensortag.MOVEMENT_DATA,
				sensortag.MOVEMENT_NOTIFICATION,
				instance.movementFun
			)

			return instance
		}

		/**
		 * Public. Turn off movement notification (SensorTag 2).
		 */
		instance.movementOff = function()
		{
			instance.sensorOff(sensortag.MOVEMENT_DATA)

			return instance
		}

		/**
		 * Public. Turn on accelerometer notification (SensorTag 1).
		 * @instance
		 * @public
		 */
		instance.accelerometerOn = function()
		{
			instance.sensorOn(
				sensortag.ACCELEROMETER_CONFIG,
				instance.accelerometerConfig,
				sensortag.ACCELEROMETER_PERIOD,
				instance.accelerometerInterval,
				sensortag.ACCELEROMETER_DATA,
				sensortag.ACCELEROMETER_NOTIFICATION,
				instance.accelerometerFun
			)

			return instance
		}

		/**
		 * Public. Turn off accelerometer notification (SensorTag 1).
		 * @instance
		 * @public
		 */
		instance.accelerometerOff = function()
		{
			instance.sensorOff(sensortag.ACCELEROMETER_DATA)

			return instance
		}

		/**
		 * Public. Turn on humidity notification.
		 * @instance
		 * @public
		 */
		instance.humidityOn = function()
		{
			instance.sensorOn(
				sensortag.HUMIDITY_CONFIG,
				instance.humidityConfig,
				null, // Not used.
				null, // Not used.
				sensortag.HUMIDITY_DATA,
				sensortag.HUMIDITY_NOTIFICATION,
				instance.humidityFun
			)

			return instance
		}

		/**
		 * Public. Turn off humidity notification.
		 * @instance
		 * @public
		 */
		instance.humidityOff = function()
		{
			instance.sensorOff(sensortag.HUMIDITY_DATA)

			return instance
		}

		/**
		 * Public. Turn on magnetometer notification.
		 * @instance
		 * @public
		 */
		instance.magnetometerOn = function()
		{
			instance.sensorOn(
				sensortag.MAGNETOMETER_CONFIG,
				instance.magnetometerConfig,
				sensortag.MAGNETOMETER_PERIOD,
				instance.magnetometerInterval,
				sensortag.MAGNETOMETER_DATA,
				sensortag.MAGNETOMETER_NOTIFICATION,
				instance.magnetometerFun
			)

			return instance
		}

		/**
		 * Public. Turn off magnetometer notification (SensorTag 1).
		 * @instance
		 * @public
		 */
		instance.magnetometerOff = function()
		{
			instance.sensorOff(sensortag.MAGNETOMETER_DATA)

			return instance
		}

		/**
		 * Public. Turn on barometer notification.
		 * @instance
		 * @public
		 */
		instance.barometerOn = function()
		{
			instance.sensorOn(
				sensortag.BAROMETER_CONFIG,
				instance.barometerConfig,
				sensortag.BAROMETER_PERIOD,
				instance.barometerInterval,
				sensortag.BAROMETER_DATA,
				sensortag.BAROMETER_NOTIFICATION,
				instance.barometerFun
			)

			return instance
		}

		/**
		 * Public. Turn off barometer notification.
		 * @instance
		 * @public
		 */
		instance.barometerOff = function()
		{
			instance.sensorOff(sensortag.BAROMETER_DATA)

			return instance
		}

		/**
		 * Public. Turn on gyroscope notification (SensorTag 1).
		 * @instance
		 * @public
		 */
		instance.gyroscopeOn = function()
		{
			instance.sensorOn(
				sensortag.GYROSCOPE_CONFIG,
				instance.gyroscopeConfig,
				sensortag.GYROSCOPE_PERIOD,
				instance.gyroscopeInterval,
				sensortag.GYROSCOPE_DATA,
				sensortag.GYROSCOPE_NOTIFICATION,
				instance.gyroscopeFun
			)

			return instance
		}

		/**
		 * Public. Turn off gyroscope notification (SensorTag 1).
		 * @instance
		 * @public
		 */
		instance.gyroscopeOff = function()
		{
			instance.sensorOff(sensortag.GYROSCOPE_DATA)

			return instance
		}


		/**
		 * Public. Turn on luxometer notification.
		 */
		instance.luxometerOn = function()
		{
			instance.sensorOn(
				sensortag.LUXOMETER_CONFIG,
				instance.luxometerConfig,
				sensortag.LUXOMETER_PERIOD,
				instance.luxometerInterval,
				sensortag.LUXOMETER_DATA,
				sensortag.LUXOMETER_NOTIFICATION,
				instance.luxometerFun
			)

			return instance
		}

		/**
		 * Public. Turn off luxometer notification.
		 */
		instance.luxometerOff = function()
		{
			instance.sensorOff(sensortag.LUXOMETER_DATA)

			return instance
		}

		/**
		 * Public. Turn on keypress notification.
		 * @instance
		 * @public
		 */
		instance.keypressOn = function()
		{
			instance.sensorOn(
				null, // Not used.
				null, // Not used.
				null, // Not used.
				null, // Not used.
				sensortag.KEYPRESS_DATA,
				sensortag.KEYPRESS_NOTIFICATION,
				instance.keypressFun
			)

			return instance
		}

		/**
		 * Public. Turn off keypress notification.
		 * @instance
		 * @public
		 */
		instance.keypressOff = function()
		{
			instance.sensorOff(sensortag.KEYPRESS_DATA)

			return instance
		}

		/**
		 * Public. Used internally as a helper function for turning on
		 * sensor notification. You can call this function from the
		 * application to enable sensors using custom parameters.
		 * For advanced use.
		 * @instance
		 * @public
		 */
		instance.sensorOn = function(
			configUUID,
			configValue,
			periodUUID,
			periodValue,
			dataUUID,
			notificationUUID,
			notificationFunction)
		{
			// Only start sensor if a notification function has been set.
			if (!notificationFunction) { return }

			// Set sensor configuration to ON.
			configUUID && instance.device.writeCharacteristic(
				configUUID,
				new Uint8Array(configValue),
				function() {},
				instance.errorFun)

			// Set sensor update period.
			periodUUID && periodValue && instance.device.writeCharacteristic(
				periodUUID,
				new Uint8Array([periodValue / 10]),
				function() {},
				instance.errorFun)

			// Set sensor notification to ON.
			dataUUID && notificationUUID && instance.device.writeDescriptor(
				dataUUID, // Characteristic for data
				notificationUUID, // Configuration descriptor
				new Uint8Array([1,0]),
				function() {},
				instance.errorFun)

			// Start sensor notification.
			dataUUID && instance.device.enableNotification(
				dataUUID,
				function(data) { notificationFunction(new Uint8Array(data)) },
				instance.errorFun)

			return instance
		}

		/**
		 * Helper function for turning off sensor notification.
		 * @instance
		 * @public
		 */
		instance.sensorOff = function(dataUUID)
		{
			// Set sensor configuration to OFF
			configUUID && instance.device.writeCharacteristic(
				configUUID,
				new Uint8Array([0]),
				function() {},
				instance.errorFun)

			dataUUID && instance.device.disableNotification(
				dataUUID,
				function() {},
				instance.errorFun)

			return instance
		}

		/**
		 * SensorTag CC2650.
		 * Calculate temperature values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: ambientTemperature, targetTemperature.
		 * @instance
		 * @public
		 */
		instance.getTemperatureValues = function(data)
		{
			// Calculate ambient temperature (Celsius).
			var ac = evothings.util.littleEndianToUint16(data, 2) / 128.0

			// Calculate target temperature (Celsius).
			var tc = evothings.util.littleEndianToInt16(data, 0)
			tc = (tc >> 2) * 0.03125

			// Return result.
			return { ambientTemperature: ac, targetTemperature: tc }
		}

		/**
		 * Calculate accelerometer values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: x, y, z.
		 * @instance
		 * @public
		 */
		instance.getAccelerometerValues = function(data)
		{
			// Set divisor based on firmware version.
			var divisor = 16.0
			/*if (instance.getDeviceModel() < 2.0 &&
				parseFloat(instance.getFirmwareString()) < 1.5)
				divisor = 4.0*/

			// Calculate accelerometer values.
			var ax = evothings.util.littleEndianToInt8(data, 0) / divisor
			var ay = evothings.util.littleEndianToInt8(data, 1) / divisor
			var az = evothings.util.littleEndianToInt8(data, 2) / divisor * -1.0

			// Return result.
			return { x: ax, y: ay, z: az }
		}

		/**
		 * Calculate accelerometer values from raw data for SensorTag 2.
		 * @param data - an Uint8Array.
		 * @return Object with fields: x, y, z.
		 */
		instance.getModelTwoAccelerometerValues = function(data)
		{
//			console.log('get model 2 accelerometer values')
			// Calculate accelerometer values.
			// JPD: was 6,8,10 changing to 0,2,4
			var ax = evothings.util.littleEndianToInt16(data, 0) / 16.0
			var ay = evothings.util.littleEndianToInt16(data, 2) / 16.0
			var az = evothings.util.littleEndianToInt16(data, 4) / 16.0 * -1.0

			// Return result.
			return { x: ax, y: ay, z: az }
			
			
		}

		/*
		 * Calculate gyroscope values from raw data for SensorTag 2.
		 * @param data - an Uint8Array.
		 * @return Object with fields: x, y, z.
		 * @instance
		 * @public
		 */
		instance.getModelTwoGyroscopeValues = function(data)
		{
//			console.log('get model 2 gyroscope values')
			// Calculate gyroscope values. NB: x,y,z has a weird order.
			// JPD: was 0,2,4 changing to 6,8,10
			var gy = -evothings.util.littleEndianToInt16(data, 6) * 500.0 / 65536.0
			var gx =  evothings.util.littleEndianToInt16(data, 8) * 500.0 / 65536.0
			var gz =  evothings.util.littleEndianToInt16(data, 10) * 500.0 / 65536.0

			// Return result.
			return { x: gx, y: gy, z: gz }
		}


		/**
		 * Calculate humidity values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: humidityTemperature, relativeHumidity.
		 * @instance
		 * @public
		 */
		instance.getHumidityValues = function(data)
		{
			// Calculate the humidity temperature (Celsius).
			var tc = -46.85 + 175.72 / 65536.0 * evothings.util.littleEndianToInt16(data, 0)

			// Calculate the relative humidity.
			var h = -6.0 + 125.00 / 65536.0 * (evothings.util.littleEndianToInt16(data, 2) & ~0x03)
 
			// Return result.
			return { humidityTemperature: tc, relativeHumidity: h }
		}

		/**
		 * Calculate magnetometer values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: x, y, z.
		 * @instance
		 * @public
		 */
		instance.getMagnetometerValues = function(data)
		{
			// Magnetometer values (Micro Tesla).
			var mx = evothings.util.littleEndianToInt16(data, 12) * (4912.0 / 32768.0)
			var my = evothings.util.littleEndianToInt16(data, 14) * (4912.0 / 32768.0)
			var mz = evothings.util.littleEndianToInt16(data, 16) * (4912.0 / 32768.0)

			// Return result.
			return { x: mx, y: my, z: mz }
		}

		/**
		 * Calculate barometer values from raw data.
		 * @todo Implement (not implemented).
		 * @instance
		 * @public
		 */
		instance.getBarometerValues = function(data)
		{
			var p = evothings.util.littleEndianToUint16(data, 2)

			// Extraction of pressure value, based on sfloatExp2ToDouble from
			// BLEUtility.m in Texas Instruments TI BLE SensorTag iOS app
			// source code.
			// TODO: Move to util.js
//			var mantissa = p & 0x0FFF
//			var exponent = p >> 12

//			magnitude = Math.pow(2, exponent)
//			output = (mantissa * magnitude)

//			var pInterpreted = output / 10000.0
//  http://forum.evothings.com/viewtopic.php?f=12&t=1465
			
			var rawP = (data[5] << 16) + (data[4] << 8) +  data[3];
            var pInterpreted = rawP / 100.0;

			return { pressure: pInterpreted }
		}

		/**
		 * Calculate gyroscope values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: x, y, z.
		 * @instance
		 * @public
		 */
		instance.getGyroscopeValues = function(data)
		{
			// Calculate gyroscope values. NB: x,y,z has a weird order.
			var gy = -evothings.util.littleEndianToInt16(data, 0) * 500.0 / 65536.0
			var gx =  evothings.util.littleEndianToInt16(data, 2) * 500.0 / 65536.0
			var gz =  evothings.util.littleEndianToInt16(data, 4) * 500.0 / 65536.0

			// Return result.
			return { x: gx, y: gy, z: gz }
		}

		/**
		 * Calculate luxometer values from raw data.
		 * @param data - an Uint8Array.
		 * @return Object with fields: luxometerData.
		 * @instance
		 * @public
		 */
		instance.getLuxometerValues = function(data)
		{
			// Calculate the light level.
			var lux = evothings.util.littleEndianToInt16(data, 0)

			// Return result.
			return { luxometerData: lux }
		}

		/**
		 * Convert Celsius to Fahrenheit.
		 * @param celsius Temperature in Celsius.
		 * @returns Temperature converted to Fahrenheit.
		 * @instance
		 * @public
		 */
		instance.celsiusToFahrenheit = function(celsius)
		{
			return (celsius * 9 / 5) + 32
		}

		// Finally, return the SensorTag instance object.
		return instance
	}

	console.log('evothings.tisensortag=sensortag')
	// make the static functions available
	evothings.tisensortag = sensortag
})()