
import FacultySupervisionList from './Admin/FacultySupervisionList';
import CreateSyllabus from './Admin/createSyllabus';
import ExamController from './Admin/examController';
import MarksEntry from './Admin/marksEntry';
import ViewSupervisionList from './Admin/viewSupervisionList';
import ViewSyllabus from './Admin/viewSyllabus';
import './App.css';
import FacultyDashboard from './Faculty/facultyDashboard';
import FacultyExam from './Faculty/facultyExam';
import FacultyLogin from './Faculty/facultyLogin';
import FacultyProfile from './Faculty/facultyProfile';
import Home from './SuperAdmin/Home';
import AssignRole from './SuperAdmin/assignRole';
import SignInSuperAdmin from './SuperAdmin/signInSuperAdmin';
import SignUpSuperAdmin from './SuperAdmin/signUpSuperAdmin';
import UpdateAssignRole from './SuperAdmin/updateAssignRole';

function App() {
  return (
    <div className="App">
      {/* <FacultyLogin/> */}
      {/* <FacultyDashboard/> */}
      {/* <FacultyExam/> */}
      {/* <FacultyProfile/> */}
      {/* <Home/> */}
      {/* <AssignRole/> */}
      {/* <UpdateAssignRole/> */}
      {/* <ExamController/> */}
      {/* <FacultySupervisionList/> */}
      {/* <ViewSupervisionList/> */}
      {/* <CreateSyllabus/> */}
      {/* <ViewSyllabus/> */}
      {/* <MarksEntry/> */}
      {/* <SignUpSuperAdmin/> */}
      <SignInSuperAdmin/>
    </div>
  );
}

export default App;
