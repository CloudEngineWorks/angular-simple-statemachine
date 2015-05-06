// the factory returns a singelton, but init returns an Object, so that you may use many
// several state machines with separate current states.
app.factory("simpleState", function() {
  return {
    init: function(current_state, ssm, notify_state_change) {
      return {
        "get_paths": function get_paths() {
          return ssm.states[current_state].trans;
        },
        "set_state": function set_state(new_state) {
          current_state = new_state;
        },
        "get_state": function () {
          return current_state;
        },
        "go": function (edge, $scope) {
          var path = this.get_paths()[edge];
          var next_state;
          if (path) {
            if (typeof path === 'string') {
              next_state = path;
            }
            else {
              next_state = path.call(null, $scope);
            }
            this.set_state(next_state);
            //$scope.$parent.$parent.course_item.view_template = next_state;
            if (notify_state_change) {
              notify_state_change(next_state);
            }
          }
          return next_state; // this might return undefined, indicating no path
        }
      };
    }
  };
});
