// inaState implements a Finite State Machine that can defined by states and transitions.
// calling the 'signal' method will transitions the current state to the next state if a transition 
// exists and an enterState method returns true.
// An angular factory returns a singelton, but init function returns an Object, so that you may use
// several state machines at once.  see below for usage.
app.factory("inaState", function () {
    return {
        init: function (machine, opt_init_signal) {
            var ops = {
                'signal': function changeState(signal, message) {
                    var current_state_name = machine.current_state_name;
                    var next_state_name = machine.trans[current_state_name][signal];
                    var ns_obj; // next_state_object 'ns_obj' may contain properties and methods of the anticipated next state
                    var ok_to_transition = true;
                    if (next_state_name) {
                        ns_obj = machine.states[next_state_name];
                        if (ns_obj && angular.isFunction(ns_obj.enterState)) {
                            ok_to_transition = ns_obj.enterState.call();
                        }
                        if (ns_obj && ok_to_transition) {
                            //console.log('on signal [' + signal + '] trans from state:' + current_state_name + ' --> ' + next_state_name);
                            machine.current_state_name = next_state_name;
                            machine.current_state = ns_obj;
                            return next_state_name;
                        }
                    }
                    //console.log('NO Transition for signal [' + signal + '] no transition from state:' + current_state_name + ' --> ' + next_state_name);
                    return '';
                },
                'getProperty': function getProperty(property_name) {
                    var display_state = machine.current_state
                    return display_state[property_name];
                }
            };
            if (opt_init_signal) {
                ops.signal(opt_init_signal);
            }
            return ops;
        }
    };
});

//// Usage:
//// Define a Statemachine with states and transitions
//// Note: States can have properties and an 'enterState' method.
//$scope.exampleStatemachine = {
//   states: {
//       'start': {},
//       'clearing_mind': { clearing_mind_icon: true },
//       'blank_slate': {},
//       'thinking': { thinking: true, thinking_icon: true },
//       'thinking_error': { bad_idea: true, need_a_new_idea:true },
//       'clearing_mind_error': { clearing_mind: true, display_error: true, enterState: function () { $timeout(function () { get_clear_mind(); }, 1000); return true; } }
//   },
//   trans: {
//       'start': { 'init': 'clearing_mind' },
//       'clearing_mind': { 'success': 'blank_slate', 'fail': 'clearing_mind_error' },
//       'blank_slate': { 'idea': 'thinking' },
//       'thinking': { 'success': 'blank_slate', 'fail': 'thinking_error' },
//       'thinking_error': { 'idea': 'thinking' },
//       'clearing_mind_error': { 'init': 'clearing_mind' }
//   },
//   current_state_name: 'start',
//       current_state: {}
//   };
//// initilize the statemachine and optionally trigger an initial transition (e.g. 'init')
// $scope.myInAStateMachine = inaState.init($scope.exampleStatemachine, 'init');
//// ... after loading happens send the statemachine a signal to transition...
// $scope.myInAStateMachine.signal('idea');
//// at any time you can ask for a property of the current state, like this.
// thinking = $scope.myInAStateMachine.getProperty('thinking');
////
