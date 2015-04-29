angular.module('carlpad')
	.directive('cpAxisConfig', ['gamepadService', function (gamepadService) {
		return {
			scope: {},
			link: function (scope, elem, attr) {
				scope.isSelected = function (index) {
					return !!scope.gamepadConfig.axes[index];
				};

				scope.toggleAxis = function (index) {
					if (!scope.gamepadConfig.axes[index]) {
						gamepadService.addAxisConfig(index);

					} else {
						gamepadService.removeAxisConfig(index);
					}
				};

				scope.gamepadConfig = gamepadService.getConfig();
				scope.gamepadData = gamepadService.getData();
			},
			templateUrl: "html/axis-configuration-directive.html"
		};
	}]);