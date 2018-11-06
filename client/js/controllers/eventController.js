angular.module('events').controller(
	'EventController',
	[
		'$scope',
		'Events',
		function ($scope, Events) {
			/* Get all the events, then bind it to the scope */
			Events.getAll().then(function (response) {
				$scope.events = response.data;
			}, function (error) {
				console.log('Unable to retrieve events:', error);
			});

			$scope.detailedInfo = undefined;

			$scope.addevent = function () {
				var item = $scope.newevent;
				var el = document.getElementById('new_event_form');
				if (item && item.name && item.address && item.code) {
					var key = {
						code : item.code,
						name : item.name,
						address : item.address,
					};
					events.create(key);
					$scope.events.push(key);
					el.style.backgroundColor = 'rgb(127, 255, 127)';
				} else {
					el.style.backgroundColor = 'rgb(255, 127, 127)';
				}
			};

			$scope.deleteevent = function (what) {
				events.delete(what._id);
				var index = $scope.events.indexOf(what);
				if (index >= 0) {
					$scope.events.splice(index, 1);
				}
			};

			$scope.showDetails = function (what) {
				$scope.detailedInfo = what;
			};
		}
	]
);
