import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
// import FacultySupervisionList from "./Admin/FacultySupervisionList";
// import CreateSyllabus from "./Admin/createSyllabus";
// import ExamController from "./Admin/examController";
import MarksEntry from "./Admin/marksEntry";
import ViewSupervisionList from "./Admin/viewSupervisionList";
import ViewSyllabus from "./Admin/viewSyllabus";
import "./App.css";
import Home from "./SuperAdmin/Home";
import AssignRole from "./SuperAdmin/assignRole";
import SignInSuperAdmin from "./SuperAdmin/signInSuperAdmin";
import SignUpSuperAdmin from "./SuperAdmin/signUpSuperAdmin";
// import UpdateAssignRole from "./SuperAdmin/updateAssignRole";
import Approve_reject_Registrations from "./SuperAdmin/approve_reject_Registrations";
import UploadExcel from "./SuperAdmin/uploadExcel";
import ExamBlockDetails from "./Admin/examBlockDetails";
import ExamAssignSupervision from "./Admin/examAssignSupervision";
import ExamTimeTable from "./Admin/examTimeTable";
import ExamViewTimeTable from "./Admin/examViewTimeTable";
import ExamViewBlockDetails from "./Admin/examViewBlockDetails";
import ExamViewJrSupervision from "./Admin/examViewJrSupervision";
import ExamViewSrSupervision from "./Admin/examViewSrSupervision";
import ExamViewOtherDuty from "./Admin/examViewOtherDuty";
import AssignMarksEntry from "./Admin/assignMarksEntry";
import ExaminationDetails from "./Admin/examinationDetails";
import LockMarks from "./Admin/lockMarks";
import UnlockMarks from "./Admin/unlockMarks";
import ViewMarks from "./Admin/viewMarks";
import Result from "./Admin/result";
import StudentResult from "./Admin/studentResult";
import AcademicUploadSyllabus from "./Admin/academicUploadSyllabus";
import StudentSyllabusView from "./Admin/studentSyllabusView";
import StudentHomePage from "./Student/studentHomePage";
import StudentCertificatePage from "./Student/studentCertificatePage";
import ForgotPassword from "./SuperAdmin/forgotPassword";
import ChangePassword from "./SuperAdmin/changePassword";
import AcademicCreateCertificate from "./Admin/academicCreateCertificate";
import AcademicCertificateRequrst from "./Admin/academicCertificateRequrst";
import FacultyDashboard from "./Faculty/facultyDashboard";
import FeeReceipt from "./Student/feeReceipt";
import CertificateTracking from "./Student/certificateTracking";
// import StudentProfile from "./Student/studentProfile";
import StudentProfile from "./Student/studentProfile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SignInSuperAdmin />} />
          <Route
            path="/universityRegistration"
            element={<SignUpSuperAdmin />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/assignRole" element={<AssignRole />} />
          <Route
            path="/approve_reject"
            element={<Approve_reject_Registrations />}
          />
          <Route path="/uploadExcel" element={<UploadExcel />} />
          {/* <Route
            path="/facultySupervisionList"
            element={<FacultySupervisionList />}
          /> */}
          <Route
            path="/facultyViewSupervisionList"
            element={<ViewSupervisionList />}
          />
          {/* <Route path="/create_syllabus" element={<CreateSyllabus />} /> */}
          <Route path="/view_syllabus" element={<ViewSyllabus />} />
          {/* <Route path="/AdminLogin" element={<AdminLogin />} /> */}
          {/* <Route path="/examController" element={<ExamController />} /> */}
          <Route path="/examBlockDetails" element={<ExamBlockDetails />} />
          <Route
            path="/examAssignSupervision"
            element={<ExamAssignSupervision />}
          />
          <Route path="/examTimeTable" element={<ExamTimeTable />} />
          <Route path="/examViewTimeTable" element={<ExamViewTimeTable />} />
          <Route
            path="/examViewBlockDetails"
            element={<ExamViewBlockDetails />}
          />
          <Route
            path="/examViewJrSupervision"
            element={<ExamViewJrSupervision />}
          />
          <Route
            path="/examViewSrSupervision"
            element={<ExamViewSrSupervision />}
          />
          <Route path="/examViewOtherDuty" element={<ExamViewOtherDuty />} />
          <Route path="/assignMarksEntry" element={<AssignMarksEntry />} />
          <Route path="/examinationDetails" element={<ExaminationDetails />} />
          <Route path="/marks_entry" element={<MarksEntry />} />
          <Route path="/lock_Marks" element={<LockMarks />} />
          <Route path="/unlock_Marks" element={<UnlockMarks />} />
          <Route path="/view_Marks/:subject_id" element={<ViewMarks />} />
          <Route path="/result" element={<Result />} />
          <Route path="/studentResult" element={<StudentResult />} />
          <Route
            path="/academic_UploadSyllabus"
            element={<AcademicUploadSyllabus />}
          />
          <Route
            path="/academic_CreactCertificate"
            element={<AcademicCreateCertificate />}
          />
          <Route
            path="/academic_CertificateRequest"
            element={<AcademicCertificateRequrst />}
          />
          <Route
            path="/StudentSyllabusView"
            element={<StudentSyllabusView />}
          />
          <Route path="/StudentHomePage" element={<StudentHomePage />} />
          <Route
            path="/StudentCertificatePage"
            element={<StudentCertificatePage />}
          />
          <Route path="/feeReceipt" element={<FeeReceipt />} />
          <Route
            path="/certificateTracking"
            element={<CertificateTracking />}
          />
          <Route path="/studentProfile" element={<StudentProfile />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/facultyDashboard" element={<FacultyDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
