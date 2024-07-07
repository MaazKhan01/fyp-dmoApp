import ActionTypes from "../actionTypes/actionTypes";

let initialState = {
  TeachersList: [],
  StudentRecords: [],
  TeacherRecords: [],
  loading: false,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case ActionTypes.TeachersList:
      state = {...state,  TeachersList: action.e};
      break;

    case ActionTypes.StudentRecords:
      state = {...state, StudentRecords: action.e};
      break;

    case ActionTypes.LoaderOn:
      state = {...state, loading: true};
      break;

    case ActionTypes.LoaderOff:
      state = {...state, loading: false};
      break;

      case ActionTypes.TeacherRecords:
        state = {...state, TeacherRecords: action.e};
        break;

  
    default:
      break;
  }
  return state;
};

export default AppReducer;