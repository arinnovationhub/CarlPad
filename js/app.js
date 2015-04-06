angular.module('carlpad', [])
	.factory('gamepadService', ['$rootScope', '$interval', '$filter', function ($rootScope, $interval, $filter) {

		var gamepad;
		var gamepadConfig = {
			buttons: [],
			axes: []
		}

		function gamepadHandler(event, connecting) {

			if (connecting) {
				gamepad = event.gamepad;
				$rootScope.$broadcast('gamepad:connected', gamepad)
			} else {
				gamepad = null;
				$rootScope.$broadcast('gamepad:disconnected')
			}
		}

		$interval(function () {
			var gamepads = navigator.getGamepads();
			var curGamepad = gamepads[0];

			if (curGamepad != null) {
				curGamepad.roundedAxes = curGamepad.axes.map(function (val) {
					return $filter('number')(val, 2);
				});
			}

			if (gamepad && !curGamepad) {
				$rootScope.$broadcast('gamepad:disconnected')
			} else if (!gamepad && curGamepad) {
				$rootScope.$broadcast('gamepad:connected', curGamepad)
			} else if (curGamepad) {
				$rootScope.$broadcast('gamepad:update', curGamepad)
			}
			gamepad = curGamepad;

		}, 1000);

		function getData() {
			return gamepad;
		}

		function getMessage() {
			var data = [];
			gamepadConfig.buttons.forEach(function (buttonConfig, i) {
				if (buttonConfig) {
					data.push(gamepad.buttons[i]);
				}
			});
			gamepadConfig.axes.forEach(function (axesConfig, i) {
				if (axesConfig) {
					data.push(gamepad.roundedAxes[i]);
				}
			});
			return data;
		}

		function addAxisConfig(index) {
			gamepadConfig.axes[index] = true;
		}

		function addButtonConfig(index) {
			gamepadConfig.buttons[index] = true;
		}

		function removeAxisConfig(index) {
			gamepadConfig.axes[index] = false;
		}

		function removeButtonConfig(index) {
			gamepadConfig.buttons[index] = false;
		}

		function getConfig() {
			return gamepadConfig;
		}

		return {
			getData: getData,
			getMessage: getMessage,
			getConfig: getConfig,
			addAxisConfig: addAxisConfig,
			removeAxisConfig: removeAxisConfig,
			addButtonConfig: addButtonConfig,
			removeButtonConfig: removeButtonConfig
		}

	}])
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
			connectionState = 'connecting'
			chrome.serial.connect(comPort, {
				bitrate: bitRate
			}, function (connectionInfo) {
				connectionInfo = connectionInfo;
				state = 'connected'
			});
		}

		var disconnect = function () {
			state = 'disconnecting'
			chrome.serial.disconnect($scope.connectionInfo.connectionId, function () {
				state = 'disconnected';
			})
		}

		var write = function () {

		}

		var getConnectionState = function () {
			return connectionState;
		}

		return {
			getDevices: getDevices,
			connect: connect,
			disconnect: disconnect,
			write: write,
			getConnectionState: getConnectionState
		}

	}])
	.directive('cpConfigPanel', [function () {
		return {
			scope: {
				configType: '@cpConfigPanel',
				panelTitle: '@cpConfigPanelTitle'
			},
			templateUrl: "html/configuration-panel-directive.html"
		}
	}])
	.directive('cpButtonConfig', ['gamepadService', function (gamepadService) {
		return {
			scope: {},
			link: function (scope, elem, attr) {
				scope.isSelected = function (index) {
					return !!scope.gamepadConfig.buttons[index];
				}
				scope.toggleButton = function (index) {
					if (!scope.gamepadConfig.buttons[index]) {
						gamepadService.addButtonConfig(index);
					} else {
						gamepadService.removeButtonConfig(index);
					}
				}
				scope.gamepadConfig = gamepadService.getConfig();
				scope.gamepadData = gamepadService.getData();
			},
			templateUrl: "html/button-configuration-directive.html"
		}
	}])
	.directive('cpAxisConfig', ['gamepadService', function (gamepadService) {
		return {
			scope: {},
			link: function (scope, elem, attr) {
				scope.isSelected = function (index) {
					return !!scope.gamepadConfig.axes[index];
				}

				scope.toggleAxis = function (index) {
					if (!scope.gamepadConfig.axes[index]) {
						gamepadService.addAxisConfig(index);

					} else {
						gamepadService.removeAxisConfig(index);
					}
				}

				scope.gamepadConfig = gamepadService.getConfig();
				scope.gamepadData = gamepadService.getData();
			},
			templateUrl: "html/axis-configuration-directive.html"
		}
	}])
	.controller('ComPortCtrl', ['$rootScope', '$scope', 'serialService', 'gamepadService', function ($rootScope, $scope, serialService, gamepadService) {
		$scope.comPorts = [];
		$scope.bitRates = [110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200]

		$scope.selectedComPort = null;
		$scope.selectedBitRate = 9600;
		$scope.outputBuffer = [];

		var outputBufferSize = 1000;

		$scope.getConnectClass = function () {
			if (!!$scope.selectedBitRate && !!$scope.selectedComPort && serialService.getConnectionState() === 'disconnected') {
				return 'btn-success';
			} else return 'disabled';
		}
		$scope.getDisconnectClass = function () {
			if (serialService.getConnectionState() === 'connected') {
				return 'btn-danger';
			} else return 'disabled';
		}
		$scope.getPanelClass = function () {
			if (serialService.getConnectionState() === 'connected' || serialService.getConnectionState() === 'disconnecting') {
				return 'panel-success';
			}
			return 'panel-danger'
		}

		$scope.connect = function () {
			serialService.connect($scope.selectedComPort.path, $scope.selectedBitRate);
		}

		$scope.disconnect = function () {
			serialService.disconnect();
		}

		$scope.getState = function () {
			return serialService.getConnectionState();
		}

		$rootScope.$on("gamepad:update", function () {
			var data = gamepadService.getData();
			//$scope.outputBuffer.push();

		});

		serialService.getDevices().then(function (devices) {
			$scope.comPorts.length = 0;
			devices.forEach(function (device) {
				$scope.comPorts.push(device);
			});
		});

	}])
	.controller('GampadConfigurationCtrl', ['$scope', 'gamepadService', function ($scope, gamepadService) {
		$scope.gamepadConfig = gamepadService.getConfig();
		$scope.gamepadData = null;
		$scope.gamepadConnected = false;

		$scope.$on('gamepad:connected', function (e, data) {
			$scope.gamepadConnected = true;
			$scope.gamepadData = data
		});

		$scope.$on('gamepad:disconnected', function () {
			$scope.gamepadConnected = false;
			$scope.gamepadData = null
		});
	}]);