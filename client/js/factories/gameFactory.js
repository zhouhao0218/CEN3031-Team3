angular.module('games', []).factory('Games', function($http) {
  var methods = {
    getAll: function() {
      return $http.get('http://localhost:8080/api/games');
    },

	  create: function(listing) {
	    return $http.post('http://localhost:8080/api/games', game);
    },

    delete: function(id) {
	   /*
        return result of HTTP delete method
       */
      return $http.delete('http://localhost:8080/api/games/'+ id);

    }
  };

  return methods;
});
