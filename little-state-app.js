// little but instructive

var app = angular.module("littleStateApp", []);

app.controller("littleStateCtrl", function($scope, simpleState) {
  
  $scope.sm = simpleState.init('unchanged', {
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
  }, 
  function(new_state) {
    $scope.current_state = new_state;
  });
  
  $scope.go = function (path) {
    $scope.template = $scope.sm.go(path, $scope);
  };
  
});

// data driven templates (with data binding)
// attrabutes:
//     data-driven-template
//     content=""
//
app.directive('stateView', function ($compile, $templateCache) {

  var linker = function(scope, element, attrs) {
    //alert(JSON.stringify(attrs.define_fn));
    scope.$watch("current_state", function() {
      var state, template;

      if (scope.content.last_state) {
        template = scope.content.last_state + '.html';
      }
      else {
        if (scope.content.id === 'new') {
          template = 'new_edit.html';
        }
        else {
          template = 'unchanged.html';
        }
      }
      element.html($templateCache.get(template));
      $compile(element.contents())(scope);
    });
  };

  return {
    restrict: "A",
    replace: true,
    link: linker,
    scope: {
      content:'=content'
    }
  };
});
