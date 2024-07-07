import ActionTypes from "../actionTypes/actionTypes";

const userExist = payload => {
  return {
    type: ActionTypes.UserExist,
    payload,
  };
};

const userInfo = payload => {
    return {
      type: ActionTypes.UserInfo,
      payload,
    };
  };

  const Logout = () => {
    return {
      type: ActionTypes.Logout,
    };
  };



export { userExist , userInfo, Logout };