angular.module('carlpad')
	.directive('cpComportConfiguration', ['$rootScope', 'serialService', 'gamepadService',
	function ($rootScope, serialService, gamepadService) {
		return {
			templateUrl: 'script/comport/comport-configuration.html',
			link: function (scope) {
				scope.comPorts = [];
				scope.bitRates = [110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200];

				scope.selectedComPort = null;
				scope.selectedBitRate = 9600;

				var outputBufferSize = 1000;

				scope.getConnectClass = function () {
					if (!!scope.selectedBitRate && !!scope.selectedComPort && serialService.getConnectionState() === 'disconnected') {
						return 'btn-success';
					} else return 'disabled';
				};

				scope.getDisconnectClass = function () {
					if (serialService.getConnectionState() === 'connected') {
						return 'btn-danger';
					} else return 'disabled';
				};

				scope.getPanelClass = function () {
					var currentState = serialService.getConnectionState();
					if (currentState === 'connected' || currentState === 'disconnecting') {
						return 'panel-success';
					}
					return 'panel-danger';
				};

				scope.connect = function () {
					serialService.connect(scope.selectedComPort.path, scope.selectedBitRate);
				};

				scope.disconnect = function () {
					serialService.disconnect();
				};

				scope.getState = function () {
					return serialService.getConnectionState();
				};

				serialService.getDevices().then(function (devices) {
					scope.comPorts.length = 0;
					devices.forEach(function (device) {
						scope.comPorts.push(device);
					});
				});
			}
		};
	}
]);