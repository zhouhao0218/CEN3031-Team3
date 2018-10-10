angular.module('listings').controller(
	'ListingsController',
	[
		'$scope',
		'Listings',
		function ($scope, Listings) {
			/* Get all the listings, then bind it to the scope */
			Listings.getAll().then(function (response) {
				$scope.listings = response.data;
			}, function (error) {
				console.log('Unable to retrieve listings:', error);
			});

			$scope.detailedInfo = undefined;

			$scope.addListing = function () {
				var item = $scope.newListing;
				var el = document.getElementById('new_listing_form');
				if (item && item.name && item.address && item.code) {
					var key = {
						code : item.code,
						name : item.name,
						address : item.address,
					};
					Listings.create(key);
					$scope.listings.push(key);
					el.style.backgroundColor = 'rgb(127, 255, 127)';
				} else {
					el.style.backgroundColor = 'rgb(255, 127, 127)';
				}
			};

			$scope.deleteListing = function (what) {
				Listings.delete(what._id);
				var index = $scope.listings.indexOf(what);
				if (index >= 0) {
					$scope.listings.splice(index, 1);
				}
			};

			$scope.showDetails = function (what) {
				$scope.detailedInfo = what;
			};
		}
	]
);
