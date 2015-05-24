angular.module('carlpad')
	.controller('GampadConfigurationCtrl', ['$scope', 'gamepadService', function ($scope, gamepadService) {
	$scope.gamepadConfig = gamepadService.getConfig();
	$scope.gamepadData = null;
	$scope.gamepadConnected = false;

	$scope.$on('gamepad:connected', function (e, data) {
		$scope.gamepadConnected = true;
		$scope.gamepadData = data;
	});

	$scope.$on('gamepad:disconnected', function () {
		$scope.gamepadConnected = false;
		$scope.gamepadData = null;
	});
}]);