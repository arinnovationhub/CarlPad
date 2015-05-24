angular.module('carlpad')
	.directive('cpComportOutput', ['$rootScope', 'gamepadService', function ($rootScope, gamepadService) {
	return {
		scope: {},
		link: function (scope, elem, attr) {
			scope.outputBuffer = [];
			var outputBufferLength = 100;
			$rootScope.$on("gamepad:update", function (event, message, rawData) {
				scope.outputBuffer.push(message);
				while (scope.outputBuffer.length > outputBufferLength) {
					scope.outputBuffer.shift();
				}
				var scrollElement = elem.children()[0];
				scrollElement.scrollTop = scrollElement.scrollHeight;
			});
		},
		templateUrl: "script/comport/comport-output.html"
	};
}]);