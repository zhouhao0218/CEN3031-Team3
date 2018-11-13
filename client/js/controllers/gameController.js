angular.module('games').controller('GamesController', ['$scope', 'Games',
  funtion($scope, Games) {
    Games.getAll().then(function(response) {
      $scope.games = response.data;
    }, function(error) {
        console.log('Unable to retrieve games:', error);
    });

    $scope.detailedInfo = undefined;

    $scope.addGame = function() {

       Games.create($scope.newGame).then(function(){
        $scope.games.push($scope.newGame);
        $scope.newGame = {};
       }, function(error){
        console.log('Unable to create game:', error);
       });
    };
    $scope.deleteGame = function(index) {

       Games.delete($scope.games[index]._id).then(function(){
         $scope.games.splice(index, 1);
       }, function(error){
        console.log('Unable to delete the game:', error);
       });
    };

    $scope.showDetails = fucntion(index){
      $scope.detailedInfo = $scope.games[index];
    };

    $scope.goEventPage = fucntion(){
      location.url('http://google.com');
    };
  }
]);
