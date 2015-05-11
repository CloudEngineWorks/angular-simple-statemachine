// little but instructive

var app = angular.module("littleStateApp", ['stateMachine']);

app.controller("littleStateCtrl", function($scope) {
  $scope.message = "";
  $scope.left  = function() {return 100 - $scope.message.length;};
  $scope.clear = function() {$scope.message = "";};
  $scope.save  = function() {alert("Note Saved");};
  
  $scope.sm = stateMachine.init('unchanged', {
    "states":{
      "unchanged":{
        "trans":{
          "edit": function ($scope) {
            $scope.previous_content = $scope.content;
            return 'editing';
          },
          "mark_for_removal": "crossout"
        }
      },
      "editing":{
        "trans":{
          "accept": function ($scope) {
            if ($scope.compare_courses($scope.previous_content, $scope.content)) {
              delete $scope.previous_content;
              return 'unchanged';
            }
            else {
              return 'changed';
            }
          },
          "revert": function ($scope) {
            $scope.content = angular.extend({}, $scope.previous_content);
            $scope.content = $scope.content;
            delete $scope.previous_content;
            return 'unchanged';
          }
        }
      },
      "changed":{
        "trans":{
          "edit": "editing",
          "restore_original": function ($scope) {
            $scope.$parent.$parent.content = angular.extend({}, $scope.previous_content);
            $scope.content = $scope.$parent.$parent.content;
            delete $scope.previous_content;
            return 'unchanged';
          }
        }
      },
      "crossout": {
        "trans": {
          "restore_original": "unchanged"
        }
      }
    }
  });
  
  $scope.go = function (path) {
    $scope.template = $scope.sm.go(path, $scope);
  };
  
});