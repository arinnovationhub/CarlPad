angular.module('carlpad')
	.factory('gamepadService', ['$rootScope', '$interval', '$filter', function ($rootScope, $interval, $filter) {

		var gamepad;
		var gamepadConfig = {
			buttons: [],
			axes: []
		};

		function gamepadHandler(event, connecting) {

			if (connecting) {
				gamepad = event.gamepad;
				$rootScope.$broadcast('gamepad:connected', gamepad);
			} else {
				gamepad = null;
				$rootScope.$broadcast('gamepad:disconnected');
			}
		}

		$interval(function () {
			var gamepads = navigator.getGamepads();
			var curGamepad = gamepads[0];

			if (curGamepad) {
				curGamepad.roundedAxes = curGamepad.axes.map(function (val) {
					return $filter('number')(val, 2);
				});
			}

			if (gamepad && !curGamepad) {
				$rootScope.$broadcast('gamepad:disconnected');
			} else if (!gamepad && curGamepad) {
				$rootScope.$broadcast('gamepad:connected', curGamepad);
			} else if (curGamepad) {
				$rootScope.$broadcast('gamepad:update', transformData(), curGamepad);
			}
			gamepad = curGamepad;

		}, 250);

		function getData() {
			return gamepad;
		}

		function transformData() {
			var data = [];
			gamepadConfig.buttons.forEach(function (buttonConfig, i) {
				if (buttonConfig) {
					data.push(buttonConfig.getValue());
				}
			});
			gamepadConfig.axes.forEach(function (axesConfig, i) {
				if (axesConfig) {
					data.push(axesConfig.getValue());
				}
			});

			return data.map(function (value) {
				return value.toString();
			}).join(",") + "\n";
		}

		function addAxisConfig(index) {
			gamepadConfig.axes[index] = {
				getValue: function () {
					return mapServo(getData().roundedAxes[index]);
				}
			};
		}

		function addButtonConfig(index) {
			gamepadConfig.buttons[index] = {
				getValue: function () {
					return getData().buttons[index].value;
				}
			};
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

		function mapServo(value) {
			return mapRange(value * 100, -100, 100, 0, 180);
		}

		function mapRange(value, inMin, inMax, outMin, outMax) {
			return Math.round((value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
		}

		return {
			getData: getData,
			getConfig: getConfig,
			addAxisConfig: addAxisConfig,
			removeAxisConfig: removeAxisConfig,
			addButtonConfig: addButtonConfig,
			removeButtonConfig: removeButtonConfig
		};

	}]);