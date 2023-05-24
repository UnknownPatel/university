
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
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
import Approve_reject_Registrations from './SuperAdmin/approve_reject_Registrations';
import UploadExcel from './SuperAdmin/uploadExcel';
import AdminLogin from './Admin/adminLogin';
import ExamBlockDetails from './Admin/examBlockDetails';
import ExamAssignSupervision from './Admin/examAssignSupervision';
import ExamTimeTable from './Admin/examTimeTable';
import ExamReports from './Admin/examReports';
import ExamViewTimeTable from './Admin/examViewTimeTable';
import ExamViewBlockDetails from './Admin/examViewBlockDetails';
import ExamViewJrSupervision from './Admin/examViewJrSupervision';
import ExamViewSrSupervision from './Admin/examViewSrSupervision';
import ExamViewOtherDuty from './Admin/examViewOtherDuty';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<SignInSuperAdmin/>} />
        <Route path='/signupSuperAdmin' element={<SignUpSuperAdmin/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/assignRole' element={<AssignRole/>} />
        <Route path="/approve_reject" element={<Approve_reject_Registrations/>} />
        <Route path="/uploadExcel" element={<UploadExcel/>} />
        <Route path="/facultySupervisionList" element={<FacultySupervisionList/>} />
        <Route path="/facultyViewSupervisionList" element={<ViewSupervisionList/>} />
        <Route path="/create_syllabus" element={<CreateSyllabus/>} />
        <Route path="/view_syllabus" element={<ViewSyllabus/>} />
        <Route path="/marks_entry" element={<MarksEntry/>} />
        <Route path="/AdminLogin" element={<AdminLogin/>}/>
        <Route path="/examController" element={<ExamController/>}/>
        <Route path="/examBlockDetails" element={<ExamBlockDetails/>}/>
        <Route path="/examAssignSupervision" element={<ExamAssignSupervision/>}/>
        <Route path="/examTimeTable" element={<ExamTimeTable/>}/>
        <Route path="/examReports" element={<ExamReports/>}/>
        <Route path="/examViewTimeTable" element={<ExamViewTimeTable/>}/>
        <Route path="/examViewBlockDetails" element={<ExamViewBlockDetails/>}/>
        <Route path="/examViewJrSupervision" element={<ExamViewJrSupervision/>}/>
        <Route path="/examViewSrSupervision" element={<ExamViewSrSupervision/>}/>
        <Route path="/examViewOtherDuty" element={<ExamViewOtherDuty/>}/>

        

        


      </Routes>
      </BrowserRouter>


      {/* <Route path='/updateAssignRole' element={<UpdateAssignRole/>} /> */}
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
      {/* <SignInSuperAdmin/> */}
      {/* <AdminLogin/> */}
      {/* <ExamBlockDetails/> */}
      {/* <ExamAssignSupervision/> */}
      {/* <ExamTimeTable/> */}
    </div>
  );
}

export default App;
