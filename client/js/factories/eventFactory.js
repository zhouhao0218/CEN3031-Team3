angular.module('listings', []).factory('Events', function($http) {
	var methods = {
		getAll: function() {
			return $http.get('/api/events');
		},
		
		create: function(listing) {
			return $http.post('/api/events', event);
		}, 

		delete: function(id) {
			return $http.delete('/api/events/' + id);
		}
	};

	return methods;
});
