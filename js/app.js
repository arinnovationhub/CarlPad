angular.module('carlpad', [])
	.factory('gamepadService', ['$rootScope', '$interval', function ($rootScope, $interval) {

		var gamepad;

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

			if (gamepad && !curGamepad) {
				$rootScope.$broadcast('gamepad:disconnected')
			} else if (!gamepad && curGamepad) {
				$rootScope.$broadcast('gamepad:connected', curGamepad)
			} else if (curGamepad) {
				$rootScope.$broadcast('gamepad:update', curGamepad)
			}
			gamepad = curGamepad;

		}, 20);

		return {

		}

	}])
	.directive('cpConfigPanel', [function () {
		return {
			scope: {
				configType: '@cpConfigPanel',
				gamepad: '=cpGamepadConfig',
				panelTitle: '@cpConfigPanelTitle'
			},
			templateUrl: "html/configuration-panel-directive.html"
		}
	}])
	.directive('cpButtonConfig', [function () {
		return {
			scope: {
				gamepad: '=cpGamepadConfig'
			},
			link: function () {
				console.log('button');
			},
			templateUrl: "html/button-configuration-directive.html"
		}
	}])
	.controller('GampadConfigurationCtrl', ['$scope', 'gamepadService', function ($scope, gamepadService) {
		$scope.gamepad = {
			connected: false,
			config: {
				buttons: [],
				axes: []
			}
		}

		$scope.$on('gamepad:connected', function (e, data) {
			console.log('connected!')
			$scope.gamepad.connected = true;
			$scope.gamepad.gamepad = data

		});

		$scope.$on('gamepad:disconnected', function () {
			$scope.gamepad.connected = false;
			$scope.gamepad.gamepad = null
		});

		$scope.$on('gamepad:update', function (e, gamepad) {
			$scope.gamepad.gamepad.buttons.forEach(function (button, i) {
				button.value = gamepad.buttons[i].value;
				button.pressed = gamepad.buttons[i].pressed;
			})
		})

	}]);