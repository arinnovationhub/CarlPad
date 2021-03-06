/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function () {
	chrome.app.window.create('index.html', {
		id: 'main',
		bounds: {
			width: 1280,
			height: 1024
		},
		minWidth: 800,
		minHeight: 600
	});
});