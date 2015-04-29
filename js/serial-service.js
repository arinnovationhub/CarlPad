angular.module('carlpad')
	.factory('serialService', ['$rootScope', '$q', function ($rootScope, $q) {

		var connectionInfo;
		var connectionState = 'disconnected';

		var getDevices = function () {
			var deferred = $q.defer();
			chrome.serial.getDevices(function (devices) {
				deferred.resolve(devices);
			});
			return deferred.promise;
		};

		var connect = function (comPort, bitRate) {
			connectionState = 'connecting';
			try {
				chrome.serial.connect(comPort, {
					bitrate: bitRate
				}, function (info) {
					connectionInfo = info;
					connectionState = 'connected';
				});
			} catch (err) {
				connectionState = 'disconnected';
				console.log(err);
			}
		};

		var disconnect = function () {
			connectionState = 'disconnecting';
			chrome.serial.disconnect(connectionInfo.connectionId, function () {
				connectionState = 'disconnected';
				connectionInfo = null;
			});
		};

		var getConnectionState = function () {
			return connectionState;
		};

		$rootScope.$on('gamepad:update', function (event, message, rawData) {
			if (connectionState == 'connected') {
				chrome.serial.send(connectionInfo.connectionId, convertStringToArrayBuffer(message), function () {

				});
			}
		});

		function convertStringToArrayBuffer(str) {
			var buf = new ArrayBuffer(str.length);
			var bufView = new Uint8Array(buf);
			for (var i = 0; i < str.length; i++) {
				bufView[i] = str.charCodeAt(i);
			}
			return buf;
		}

		return {
			getDevices: getDevices,
			connect: connect,
			disconnect: disconnect,
			getConnectionState: getConnectionState
		};

	}]);