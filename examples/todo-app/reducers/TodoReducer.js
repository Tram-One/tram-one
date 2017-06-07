const TodoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return Object.assign({}, state, {
        todos: [state.text].concat(state.todos),
        text: ''
      });
    case 'COMPLETE_TODO':
      return Object.assign({}, state, {
        todos: state.todos.filter(
          (item, index) => index !== action.index
        ),
        dones: state.dones.concat(state.todos[action.index])
      })
    case 'UPDATE_INPUT':
      return Object.assign({}, state, {
        text: action.text
      });
    default:
      return state;
  }
}

module.exports = TodoReducer;
