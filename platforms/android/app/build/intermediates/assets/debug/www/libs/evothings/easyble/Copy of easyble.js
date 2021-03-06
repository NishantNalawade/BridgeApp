/**
 * File: easyble.js
 * Description: Library for making BLE programming easier.
 * Author: Miki
 *
 * Note: The object type called "device" below, is the "DeviceInfo"
 * object obtained by calling evothings.ble.startScan, enhanced with
 * additional properties and functions to allow easy access to
 * object methods. Properties are also added to the Characteristic
 * and Descriptor object. Added properties are prefixed with two
 * underscores.
 */

evothings.loadScript('libs/evothings/util/util.js');

var base64 = cordova.require('cordova/base64');

// Object that holds BLE data and functions.
evothings.easyble = (function()
{
	/** Main object in the EasyBLE API. */
	var easyble = {};

	/**
	 * Set to true to report found devices only once,
	 * set to false to report continuously.
	 */
	var reportDeviceOnce = false;

	var serviceFilter = false;

	/** Internal properties and functions. */
	var internal = {};

	/** Internal variable used to track reading of service data. */
	var readCounter = 0;

	/** Table of discovered devices. */
	internal.knownDevices = {};

	/** Table of connected devices. */
	internal.connectedDevices = {};

	/**
	 * Set to true to report found devices only once.
	 * Set to false to report continuously.
	 * The default is to report continously.
	 */
	easyble.reportDeviceOnce = function(reportOnce)
	{
		reportDeviceOnce = reportOnce;
	};

	/**
	* Set to an Array of UUID strings to enable filtering of devices found by startScan().
	* Set to false to disable filtering.
	* The default is to not filter.
	* An empty array will cause no devices to be reported.
	*/
	easyble.filterDevicesByService = function(services)
	{
		serviceFilter = services;
	};

	/** Start scanning for devices. */
	easyble.startScan = function(win, fail)
	{
		easyble.stopScan();
		internal.knownDevices = {};
		evothings.ble.startScan(function(device)
		{
			// Ensure we have advertisementData.
			internal.ensureAdvertisementData(device);

			// Check if the device matches the filter, if we have a filter.
			if(!internal.deviceMatchesServiceFilter(device)) {
				return;
			}

			// Check if we already have got the device.
			var existingDevice = internal.knownDevices[device.address]
			if (existingDevice)
			{
				// Do not report device again if flag is set.
				if (reportDeviceOnce) { return; }

				// Flag not set, report device again.
				existingDevice.rssi = device.rssi;
				existingDevice.name = device.name;
				existingDevice.scanRecord = device.scanRecord;
				existingDevice.advertisementData = device.advertisementData;
				win(existingDevice);
//				console.log(JSON.stringify(device));
				return;
			}

			// New device, add to known devices.
			internal.knownDevices[device.address] = device;

			// Add methods to the device info object.
			internal.addMethodsToDeviceObject(device);

			// Call callback function with device info.
			win(device);
		},
		function(errorCode)
		{
			fail(errorCode);
		});
	};

	/** Stop scanning for devices. */
	easyble.stopScan = function()
	{
		evothings.ble.stopScan();
	};

	/** Close all connected devices. */
	easyble.closeConnectedDevices = function()
	{
		for (var key in internal.connectedDevices)
		{
			var device = internal.connectedDevices[key];
			device && device.close();
			internal.connectedDevices[key] = null;
		}
	};

	/**
	* If device has advertisementData, does nothing.
	* If device instead has scanRecord, creates advertisementData.
	* See ble.js for AdvertisementData reference.
	*/
	internal.ensureAdvertisementData = function(device)
	{
		// If device object already has advertisementData we
		// do not need to parse the scanRecord.
		if (device.advertisementData) { return; }

		// Must have scanRecord yo continue.
		if (!device.scanRecord) { return; }

		// Here we parse BLE/GAP Scan Response Data.
		// See the Bluetooth Specification, v4.0, Volume 3, Part C, Section 11,
		// for details.

		var byteArray = evothings.util.base64DecToArr(device.scanRecord);
		var pos = 0;
		var advertisementData = {};
		var serviceUUIDs;
		var serviceData;

		// The scan record is a list of structures.
		// Each structure has a length byte, a type byte, and (length-1) data bytes.
		// The format of the data bytes depends on the type.
		// Malformed scanRecords will likely cause an exception in this function.
		while (pos < byteArray.length)
		{
			var length = byteArray[pos++];
			if (length == 0)
			{
				break;
			}
			length -= 1;
			var type = byteArray[pos++];

			// Parse types we know and care about.
			// Skip other types.

			var BLUETOOTH_BASE_UUID = '-0000-1000-8000-00805f9b34fb'

			// Convert 16-byte Uint8Array to RFC-4122-formatted UUID.
			function arrayToUUID(array, offset)
			{
				var k=0;
				var string = '';
				var UUID_format = [4, 2, 2, 2, 6];
				for (var l=0; l<UUID_format.length; l++)
				{
					if (l != 0)
					{
						string += '-';
					}
					for (var j=0; j<UUID_format[l]; j++, k++)
					{
						string += evothings.util.toHexString(array[offset+k], 1);
					}
				}
				return string;
			}

			if (type == 0x02 || type == 0x03) // 16-bit Service Class UUIDs.
			{
				serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
				for(var i=0; i<length; i+=2)
				{
					serviceUUIDs.push(
						'0000' +
						evothings.util.toHexString(
							evothings.util.littleEndianToUint16(byteArray, pos + i),
							2) +
						BLUETOOTH_BASE_UUID);
				}
			}
			if (type == 0x04 || type == 0x05) // 32-bit Service Class UUIDs.
			{
				serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
				for (var i=0; i<length; i+=4)
				{
					serviceUUIDs.push(
						evothings.util.toHexString(
							evothings.util.littleEndianToUint32(byteArray, pos + i),
							4) +
						BLUETOOTH_BASE_UUID);
				}
			}
			if (type == 0x06 || type == 0x07) // 128-bit Service Class UUIDs.
			{
				serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
				for (var i=0; i<length; i+=16)
				{
					serviceUUIDs.push(arrayToUUID(byteArray, pos + i));
				}
			}
			if (type == 0x08 || type == 0x09) // Local Name.
			{
				advertisementData.kCBAdvDataLocalName = evothings.ble.fromUtf8(
					new Uint8Array(byteArray.buffer, pos, length));
			}
			if (type == 0x0a) // TX Power Level.
			{
				advertisementData.kCBAdvDataTxPowerLevel =
					evothings.util.littleEndianToInt8(byteArray, pos);
			}
			if (type == 0x16) // Service Data, 16-bit UUID.
			{
				serviceData = serviceData ? serviceData : {};
				var uuid =
					'0000' +
					evothings.util.toHexString(
						evothings.util.littleEndianToUint16(byteArray, pos),
						2) +
					BLUETOOTH_BASE_UUID;
				var data = new Uint8Array(byteArray.buffer, pos+2, length-2);
				serviceData[uuid] = base64.fromArrayBuffer(data);
			}
			if (type == 0x20) // Service Data, 32-bit UUID.
			{
				serviceData = serviceData ? serviceData : {};
				var uuid =
					evothings.util.toHexString(
						evothings.util.littleEndianToUint32(byteArray, pos),
						4) +
					BLUETOOTH_BASE_UUID;
				var data = new Uint8Array(byteArray.buffer, pos+4, length-4);
				serviceData[uuid] = base64.fromArrayBuffer(data);
			}
			if (type == 0x21) // Service Data, 128-bit UUID.
			{
				serviceData = serviceData ? serviceData : {};
				var uuid = arrayToUUID(byteArray, pos);
				var data = new Uint8Array(byteArray.buffer, pos+16, length-16);
				serviceData[uuid] = base64.fromArrayBuffer(data);
			}
			if (type == 0xff) // Manufacturer-specific Data.
			{
				// Annoying to have to transform base64 back and forth,
				// but it has to be done in order to maintain the API.
				advertisementData.kCBAdvDataManufacturerData =
					base64.fromArrayBuffer(new Uint8Array(byteArray.buffer, pos, length));
			}

			pos += length;
		}
		advertisementData.kCBAdvDataServiceUUIDs = serviceUUIDs;
		advertisementData.kCBAdvDataServiceData = serviceData;
		device.advertisementData = advertisementData;

		
		// Log raw data for debugging purposes.
		var srs = ''
		for(var i=0; i<byteArray.length; i++) {
			srs += evothings.util.toHexString(byteArray[i], 1);
		}
		console.log("scanRecord: "+srs);

		console.log(JSON.stringify(advertisementData));
		
	}

	/**
	* Returns true if the device matches the serviceFilter, or if there is no filter.
	* Returns false otherwise.
	*/
	internal.deviceMatchesServiceFilter = function(device)
	{
		if (!serviceFilter) { return true; }

		var advertisementData = device.advertisementData;
		if (advertisementData)
		{
			if (advertisementData.kCBAdvDataServiceUUIDs)
			{
				for (var i in advertisementData)
				{
					for (var j in serviceFilter)
					{
						if (advertisementData[i].toLowerCase() ==
							serviceFilter[j].toLowerCase())
						{
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	/**
	 * Add functions to the device object to allow calling them
	 * in an object-oriented style.
	 */
	internal.addMethodsToDeviceObject = function(device)
	{
		/** Connect to the device. */
		device.connect = function(win, fail)
		{
			internal.connectToDevice(device, win, fail);
		};

		/** Close the device. */
		device.close = function()
		{
			device.deviceHandle && evothings.ble.close(device.deviceHandle);
		};

		/** Read devices RSSI. Device must be connected. */
		device.readRSSI = function(win, fail)
		{
			evothings.ble.rssi(device.deviceHandle, win, fail);
		};

		/**
		 * Read all service info for the specified service UUIDs.
		 * @param serviceUUIDs - array of UUID strings
		 * @param win - success callback
		 * @param fail - error callback
		 * If serviceUUIDs is null, info for all services is read
		 * (this can be time-consuming compared to reading a
		 * selected number of services).
		 */
		device.readServices = function(serviceUUIDs, win, fail)
		{
			internal.readServices(device, serviceUUIDs, win, fail);
		};

		/** Read value of characteristic. */
		device.readCharacteristic = function(characteristicUUID, win, fail)
		{
			internal.readCharacteristic(device, characteristicUUID, win, fail);
		};

		/** Read value of descriptor. */
		device.readDescriptor = function(characteristicUUID, descriptorUUID, win, fail)
		{
			internal.readDescriptor(device, characteristicUUID, descriptorUUID, win, fail);
		};

		/** Write value of characteristic. */
		device.writeCharacteristic = function(characteristicUUID, value, win, fail)
		{
			internal.writeCharacteristic(device, characteristicUUID, value, win, fail);
		};

		/** Write value of descriptor. */
		device.writeDescriptor = function(characteristicUUID, descriptorUUID, value, win, fail)
		{
			internal.writeDescriptor(device, characteristicUUID, descriptorUUID, value, win, fail);
		};

		/** Subscribe to characteristic value updates. */
		device.enableNotification = function(characteristicUUID, win, fail)
		{
			internal.enableNotification(device, characteristicUUID, win, fail);
		};

		/** Unsubscribe from characteristic updates. */
		device.disableNotification = function(characteristicUUID, win, fail)
		{
			internal.disableNotification(device, characteristicUUID, win, fail);
		};
	};

	/** Connect to a device. */
	internal.connectToDevice = function(device, win, fail)
	{
		evothings.ble.connect(device.address, function(connectInfo)
		{
			if (connectInfo.state == 2) // connected
			{
				device.deviceHandle = connectInfo.deviceHandle;
				device.__uuidMap = {};
				internal.connectedDevices[device.address] = device;

				win(device);
			}
			else if (connectInfo.state == 0) // disconnected
			{
				internal.connectedDevices[device.address] = null;
				// TODO: How to signal disconnect?
				// Call error callback?
				// Additional callback? (connect, disconnect, fail)
				// Additional parameter on win callback with connect state?
				// (Last one is the best option I think).
				fail && fail('disconnected');
			}
		},
		function(errorCode)
		{
			fail(errorCode);
		});
	};

	/**
	 * Obtain device services, them read characteristics and descriptors
	 * for the services with the given uuid(s).
	 * If serviceUUIDs is null, info is read for all services.
	 */
	internal.readServices = function(device, serviceUUIDs, win, fail)
	{
		// Read services.
		evothings.ble.services(
			device.deviceHandle,
			function(services)
			{
				// Array that stores services.
				device.__services = [];

				for (var i = 0; i < services.length; ++i)
				{
					var service = services[i];
					service.uuid = service.uuid.toLowerCase();
					device.__services.push(service);
					device.__uuidMap[service.uuid] = service;
				}

				internal.readCharacteristicsForServices(
					device, serviceUUIDs, win, fail);
			},
			function(errorCode)
			{
				fail(errorCode);
			});
	};

	/**
	 * Read characteristics and descriptors for the services with the given uuid(s).
	 * If serviceUUIDs is null, info for all services are read.
	 * Internal function.
	 */
	internal.readCharacteristicsForServices = function(device, serviceUUIDs, win, fail)
	{
		var characteristicsCallbackFun = function(service)
		{
			// Array with characteristics for service.
			service.__characteristics = [];

			return function(characteristics)
			{
				--readCounter; // Decrements the count added by services.
				readCounter += characteristics.length;
				for (var i = 0; i < characteristics.length; ++i)
				{
					var characteristic = characteristics[i];
					characteristic.uuid = characteristic.uuid.toLowerCase();
					service.__characteristics.push(characteristic);
					device.__uuidMap[characteristic.uuid] = characteristic;

					// Read descriptors for characteristic.
					evothings.ble.descriptors(
						device.deviceHandle,
						characteristic.handle,
						descriptorsCallbackFun(characteristic),
						function(errorCode)
						{
							fail(errorCode);
						});
				}
			};
		};

		var descriptorsCallbackFun = function(characteristic)
		{
			// Array with descriptors for characteristic.
			characteristic.__descriptors = [];

			return function(descriptors)
			{
				--readCounter; // Decrements the count added by characteristics.
				for (var i = 0; i < descriptors.length; ++i)
				{
					var descriptor = descriptors[i];
					descriptor.uuid = descriptor.uuid.toLowerCase();
					characteristic.__descriptors.push(descriptor);
					device.__uuidMap[characteristic.uuid + ':' + descriptor.uuid] = descriptor;
				}
				if (0 == readCounter)
				{
					// Everything is read.
					win(device);
				}
			};
		};

		// Initialize read counter.
		readCounter = 0;

		if (null != serviceUUIDs)
		{
			// Read info for service UUIDs.
			readCounter = serviceUUIDs.length;
			for (var i = 0; i < serviceUUIDs.length; ++i)
			{
				var uuid = serviceUUIDs[i].toLowerCase();
				var service = device.__uuidMap[uuid];
				if (!service)
				{
					fail('Service not found: ' + uuid);
					return;
				}

				// Read characteristics for service. Will also read descriptors.
				evothings.ble.characteristics(
					device.deviceHandle,
					service.handle,
					characteristicsCallbackFun(service),
					function(errorCode)
					{
						fail(errorCode);
					});
			}
		}
		else
		{
			// Read info for all services.
			readCounter = device.__services.length;
			for (var i = 0; i < device.__services.length; ++i)
			{
				// Read characteristics for service. Will also read descriptors.
				var service = device.__services[i];
				evothings.ble.characteristics(
					device.deviceHandle,
					service.handle,
					characteristicsCallbackFun(service),
					function(errorCode)
					{
						fail(errorCode);
					});
			}
		}
	};

	internal.readCharacteristic = function(device, characteristicUUID, win, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail('Characteristic not found: ' + characteristicUUID);
			return;
		}

		evothings.ble.readCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			win,
			fail);
	};

	internal.readDescriptor = function(device, characteristicUUID, descriptorUUID, win, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();
		descriptorUUID = descriptorUUID.toLowerCase();

		var descriptor = device.__uuidMap[characteristicUUID + ':' + descriptorUUID];
		if (!descriptor)
		{
			fail('Descriptor not found: ' + descriptorUUID);
			return;
		}

		evothings.ble.readDescriptor(
			device.deviceHandle,
			descriptor.handle,
			value,
			function()
			{
				win();
			},
			function(errorCode)
			{
				fail(errorCode);
			});
	};

	internal.writeCharacteristic = function(device, characteristicUUID, value, win, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail('Characteristic not found: ' + characteristicUUID);
			return;
		}

		console.log('before writec');
		evothings.ble.writeCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			value,
			function()
			{
				console.log(JSON.stringify(characteristicUUID))
				win();
				console.log(JSON.stringify(value))
			},
			function(errorCode)
			{
				fail(errorCode);
			});
		console.log('after writec');
	};

	internal.writeDescriptor = function(device, characteristicUUID, descriptorUUID, value, win, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();
		descriptorUUID = descriptorUUID.toLowerCase();

		var descriptor = device.__uuidMap[characteristicUUID + ':' + descriptorUUID];
		if (!descriptor)
		{
			fail('Descriptor not found: ' + descriptorUUID);
			return;
		}

		evothings.ble.writeDescriptor(
			device.deviceHandle,
			descriptor.handle,
			value,
			function()
			{
				win();
			},
			function(errorCode)
			{
				fail(errorCode);
			});
	};

	internal.enableNotification = function(device, characteristicUUID, win, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail('Characteristic not found: ' + characteristicUUID);
			return;
		}

		evothings.ble.enableNotification(
			device.deviceHandle,
			characteristic.handle,
			win,
			fail);
	};

	internal.disableNotification = function(device, characteristicUUID, win, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail('Characteristic not found: ' + characteristicUUID);
			return;
		}

		evothings.ble.disableNotification(
			device.deviceHandle,
			characteristic.handle,
			win,
			fail);
	};

	// For debugging. Example call:
	// easyble.printObject(device, console.log);
	easyble.printObject = function(obj, printFun)
	{
		function print(obj, level)
		{
			var indent = new Array(level + 1).join('  ');
			for (var prop in obj)
			{
				if (obj.hasOwnProperty(prop))
				{
					var value = obj[prop];
					if (typeof value == 'object')
					{
						printFun(indent + prop + ':');
						print(value, level + 1);
					}
					else
					{
						printFun(indent + prop + ': ' + value);
					}
				}
			}
		}
		print(obj, 0);
	};

	easyble.reset = function()
	{
		evothings.ble.reset();
	};

	return easyble;
})();
