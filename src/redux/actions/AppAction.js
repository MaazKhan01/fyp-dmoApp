import ActionTypes from "../actionTypes/actionTypes";


const loaderOn = () => {
  return {
    type: ActionTypes.LoaderOn,
  };
};

const loaderOff = () => {
  return {
    type: ActionTypes.LoaderOff,
  };
};



const teachersList = (e) => {
  return {
    type: ActionTypes.TeachersList,
    e,
  };
};

const studentRecords = (e) => {
  return {
    type: ActionTypes.StudentRecords,
    e,
  };
};

const teacherRecords = (e) => {
  return {
    type: ActionTypes.TeacherRecords,
    e,
  };
};

export { loaderOn, loaderOff, teachersList, studentRecords, teacherRecords  };