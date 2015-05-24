angular.module('carlpad')
	.directive('cpConfigurationPanel', [function () {
	return {
		scope: {
			configType: '@cpConfigPanel',
			panelTitle: '@cpConfigPanelTitle'
		},
		templateUrl: "script/gamepad/configuration-panel.html"
	};
}]);