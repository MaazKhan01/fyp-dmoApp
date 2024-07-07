import ActionTypes from "../actionTypes/actionTypes";

let initialState = {
  userExist: false,
  userInfo: null
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UserExist:
      state = { ...state, userExist: action.payload };
      break;

    case ActionTypes.UserInfo:
      state = { ...state, userInfo: action.payload };
      break;

    case ActionTypes.Logout:
      state = { userExist: false, userInfo: null, };
      break;


    default:
      break;
  }
  return state;
};

export default AuthReducer;