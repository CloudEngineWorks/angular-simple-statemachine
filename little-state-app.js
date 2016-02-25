// little but instructive
(function(angular) {
app = angular.module("littleStateApp", []);

app.controller("littleStateCtrl", function($scope, inaState) {
  
  $scope.exampleStatemachine = {
    states: {
       'start': {},
       'clearing_mind': { clearing_mind_icon: true },
       'blank_slate': {},
       'thinking': { thinking: true, thinking_icon: true },
       'thinking_error': { bad_idea: true, need_a_new_idea:true },
       'clearing_mind_error': { clearing_mind: true, display_error: true, 
          enterState: function () { $timeout(function () { get_clear_mind(); }, 1000); return true; }
        }
    },
    trans: {
       'start': { 'init': 'clearing_mind' },
       'clearing_mind': { 'success': 'blank_slate', 'fail': 'clearing_mind_error' },
       'blank_slate': { 'idea': 'thinking' },
       'thinking': { 'success': 'blank_slate', 'fail': 'thinking_error' },
       'thinking_error': { 'idea': 'thinking' },
       'clearing_mind_error': { 'init': 'clearing_mind' }
    },
    current_state_name: 'start',
    current_state: {}
  };
  
  $scope.myInAStateMachine = inaState.init($scope.exampleStatemachine, 'init');
  
  
});
})(window.angular);
