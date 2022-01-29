export default function reportIdReducer(state = '', action) {
  if (action.type == 'addReportId') {
    return action.payload;
  } else {
    return state;
  }
}
