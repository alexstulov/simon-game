'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.appName = 'Simon';
  $scope.tonesCounter = 0;
  $scope.aiTonesCounter = 0;
  $scope.isOn = false;
  $scope.isStrict = false;
  $scope.isUserTurn = false;
  $scope.aiTune = [];
  $scope.userTune = [];
  $scope.countScreen = '';

  $scope.setToDefaults = function() {
      $scope.isOn = false;
      $scope.tonesCounter = 0;
      $scope.aiTonesCounter = 0;
      $scope.isStrict = false;
      $scope.isUserTurn = false;
      $scope.aiTune = [];
      $scope.userTune = [];
      $scope.countScreen = '';
  };

  $scope.toggleStrictMode = function() {
      $scope.isStrict = !$scope.isStrict;
  };

  $scope.clickSection = function($event) {
      if (!$scope.isOn) {
          return;
      }

      if (!$scope.isUserTurn) {
          return;
      }
      $scope.isUserTurn = false;
      $timeout(function(){$scope.isUserTurn = true;}, 1000);

      var self = $event.currentTarget;

      pointTheButton(self);
      $scope.userTune.push($(self).data("tune-code"));
      checkTune();
  };

  var pointTheButton = function(button) {
      var $button = $(button);
      $button.removeClass('section-' + $button.data('tune-code'));
      $button.addClass('section-alt-' + $button.data('tune-code'));

      playSound($button.data('tune-code'));
      $timeout(function() {
          $button.removeClass('section-alt-' + $button.data('tune-code'));
          $button.addClass('section-' + $button.data('tune-code'));
      }, 500);
  };

  $scope.togglePower = function() {
      if($scope.isOn) {
          $scope.isOn = false;
          $scope.setToDefaults();
      } else {
          $scope.isOn = true;
          $scope.countScreen = '--';
      }
  };

  $scope.startTheGame = function() {
      $scope.tonesCounter = 0;
      $scope.aiTonesCounter = 0;
      $scope.aiTune = [];
      $scope.userTune = [];
      $scope.countScreen = '--';
      generateTune();

      $timeout(aiMove, 1000);

      // setTimeout(function() {aiMove();}, 1000);
  };

  $scope.restartAfterWrongMove = function() {
      $scope.tonesCounter = 0;
      $scope.aiTonesCounter = 0;
      $scope.userTune = [];
      $scope.isUserTurn = false;
      $scope.countScreen = '--';
      $timeout(function() {aiMove();}, 1000);
  };

  var aiMove = function () {
      $scope.isUserTurn = false;
      var summ = 0;
      $scope.countScreen = $scope.aiTonesCounter + 1;
      for (var i = 0; i <= $scope.aiTonesCounter; i++) {
          summ++;
          (function(ind) {
              $timeout(function(){pointTheButton('.section[data-tune-code="' + $scope.aiTune[ind] + '"]')}, 1000 * ind);
          })(i);
      }
      $scope.aiTonesCounter++;
      $timeout(function(){$scope.isUserTurn = true;}, 1000 * summ);
  };

  var checkTune = function() {
      // console.log($scope.aiTune);
      // console.log($scope.userTune);
      if ($scope.aiTune[$scope.tonesCounter] !== $scope.userTune[$scope.tonesCounter]) {
          $scope.countScreen = '!!';
          playSound('blue');
          playSound('red');
          playSound('green');
          playSound('yellow');
          // wrong move tune should be played
          if ($scope.isStrict) {
              $timeout(function() {
                  $scope.startTheGame();
              }, 2000);
          } else {
              $timeout(function() {
                  $scope.restartAfterWrongMove();
              }, 2000);

          }

          return;
      }
      $scope.tonesCounter++;
      if($scope.tonesCounter === $scope.aiTonesCounter && $scope.aiTonesCounter === 20) {
          alert('You won!');
          $timeout(function() {
              $scope.startTheGame();
          }, 2000);
      } else if($scope.tonesCounter === $scope.aiTonesCounter) {
          $scope.tonesCounter = 0;
          $scope.userTune = [];
          $timeout(function() {aiMove()}, 2000);
      }
  };

  var generateTune = function() {
      var randomInteger = 0;
      for (var i = 0; i < 50; i++) {
          randomInteger = Math.floor(Math.random() * Math.floor(4)) + 1;
          switch(randomInteger) {
              case 1:
                  $scope.aiTune.push('green');
                  break;
              case 2:
                  $scope.aiTune.push('red');
                  break;
              case 3:
                  $scope.aiTune.push('yellow');
                  break;
              case 4:
                  $scope.aiTune.push('blue');
                  break;
          }
      }
  };

  var playSound = function(id) {
      var src = '';
      switch (id) {
          case 'green':
              src = 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3';
              break;
          case 'red':
              src = 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3';
              break;
          case 'blue':
              src = 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3';
              break;
          case 'yellow':
              src = 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3';
              break;
      }
      var myAudio = new Audio(src);
    myAudio.loop = false;
      myAudio.play();
      myAudio.currentTime = 0;
      myAudio.play();
  };
}]);