/* register the modules the application depends upon here*/
angular.module('events', []);
angular.module('games', []);

/* register the application and inject all the necessary dependencies */
var app = angular.module('hostEvent', ['events']);
