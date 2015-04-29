angular.module('carlpad')
	.directive('cpConfigPanel', [function () {
		return {
			scope: {
				configType: '@cpConfigPanel',
				panelTitle: '@cpConfigPanelTitle'
			},
			templateUrl: "html/configuration-panel-directive.html"
		};
	}]);