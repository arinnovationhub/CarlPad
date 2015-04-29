angular.module('carlpad')
	.directive('cpButtonConfig', ['gamepadService', function (gamepadService) {
		return {
			scope: {},
			link: function (scope, elem, attr) {
				scope.isSelected = function (index) {
					return !!scope.gamepadConfig.buttons[index];
				};
				scope.toggleButton = function (index) {
					if (!scope.gamepadConfig.buttons[index]) {
						gamepadService.addButtonConfig(index);
					} else {
						gamepadService.removeButtonConfig(index);
					}
				};
				scope.gamepadConfig = gamepadService.getConfig();
				scope.gamepadData = gamepadService.getData();
			},
			templateUrl: "html/button-configuration-directive.html"
		};
	}]);