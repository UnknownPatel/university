
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
import AssignMarksEntry from './Admin/assignMarksEntry';
import ExaminationDetails from './Admin/examinationDetails';
import LockMarks from './Admin/lockMarks';
import UnlockMarks from './Admin/unlockMarks';
import ViewMarks from './Admin/viewMarks';
import Result from './Admin/result';
import StudentResult from './Admin/studentResult';
import AcademicUploadSyllabus from './Admin/academicUploadSyllabus';
import StudentViewSyllabus from './Admin/studentViewSyllabus';
import UploadSubjectDetails from './Admin/uploadSubjectDetails';

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
        <Route path="/assignMarksEntry" element={<AssignMarksEntry/>}/>
        <Route path="/examinationDetails" element={<ExaminationDetails/>}/>
        <Route path="/marks_entry" element={<MarksEntry/>} />
        <Route path="/lock_Marks" element={<LockMarks/>}/>
        <Route path="/unlock_Marks" element={<UnlockMarks/>}/>
        <Route path="/view_Marks/:subject_id" element={<ViewMarks/>}/>
        <Route path="/result" element={<Result/>}/>
        <Route path="/studentResult" element={<StudentResult/>}/>
        <Route path="/academic_UploadSyllabus" element={<AcademicUploadSyllabus/>}/>
        <Route path="/student_view_syllabus" element={<StudentViewSyllabus/>}/>
        <Route path="/upload_SubjectDetails" element={<UploadSubjectDetails/>}/>



        

        


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
