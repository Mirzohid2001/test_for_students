import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AcademyList from './components/AcademyList';
import AcademyDetail from './components/AcademyDetail';
import TeacherList from './components/TeacherList';
import TeacherDetail from './components/TeacherDetail';
import GroupList from './components/GroupList';
import GroupDetail from './components/GroupDetail';
import GroupListFinalExam from './components/GroupListFinalExam';
import GroupDetailFinalExam from './components/GroupDetailFinalExam';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserDetailFinalExam from './components/UserDetailFinalExam';
import CheckpointsList from './components/CheckpointsList';
import QuestionsList from './components/QuestionsList';
import ExaminationList from './components/ExaminationList';
import ExaminationDetail from './components/ExaminationDetail';
import ResultList from './components/ResultList';
import RetakeList from './components/RetakeList';
import FinalExamStart from './components/FinalExamStart';
import FinalExamSubmit from './components/FinalExamSubmit';
import FinalExamRetakeList from './components/FinalExamRetakeList';
import FinalExamRetakeSubmit from './components/FinalExamRetakeSubmit';
import GroupAverage from './components/GroupAverage';
import TeacherAverage from './components/TeacherAverage';
import AcademyAverage from './components/AcademyAverage';
import FinalExamRetake from "./components/FinalExamRetake";
import NewsList from "./components/NewsList";
import MasterClassList from "./components/MasterClassList";
import StartExam from "./components/StartExam";
import ConcursGroupList from "./components/ConcursGroupList";
import ConcursUserList from "./components/ConcursUserList";
import ConcursSubmitAnswers from "./components/ConcursSubmitAnswers";
import ConcursWinner from "./components/ConcursWinner";
import Home from './components/Home';
import Navbar from './components/Navbar';
import './App.css';
import './static/loader.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/academies" element={<AcademyList />} />
                <Route path="/academies/:id" element={<AcademyDetail />} />
                <Route path="/teachers" element={<TeacherList />} />
                <Route path="/teachers/:id" element={<TeacherDetail />} />
                <Route path="/groups" element={<GroupList />} />
                <Route path="/groups/:id" element={<GroupDetail />} />
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/user/:userId" element={<UserDetail />} />
                <Route path="/checkpoints" element={<CheckpointsList />} />
                <Route path="/questions" element={<QuestionsList />} />
                <Route path="/examinations" element={<ExaminationList />} />
                <Route path="/examinations/:id" element={<ExaminationDetail />} />
                <Route path="/results" element={<ResultList />} />
                <Route path="/final-exam-start/:userId/:groupId" element={<FinalExamStart />} />
                <Route path="/finalexam-groups" element={<GroupListFinalExam />} />
                <Route path="/finalexam-groups/:id" element={<GroupDetailFinalExam />} />
                <Route path="/finalexam-submit/:userId/:groupId" element={<FinalExamSubmit />} />
                <Route path="/finalexam-retakes" element={<FinalExamRetakeList />} />
                <Route path="/retakes" element={<RetakeList />} />
                <Route path="/finalexam-retake/:userId/:groupId" element={<FinalExamRetake />} />
                <Route path="/finalexam-retake-submit/:userId/:groupId" element={<FinalExamRetakeSubmit />} />
                <Route path="/group-average/:groupId" element={<GroupAverage />} />
                <Route path="/teacher-average/:teacherId" element={<TeacherAverage />} />
                <Route path="/academy-average/:academyId" element={<AcademyAverage />} />
                <Route path="/news" element={<NewsList />} />
                <Route path="/masterclass" element={<MasterClassList />} />
                <Route path="/start-exam/:userId/:groupId" element={<StartExam />} />
                <Route path="/concurs-groups" element={<ConcursGroupList />} />
                <Route path="/concurs/groups/:groupId/users" element={<ConcursUserList />} />
                <Route path="/concurs-submit/:groupId/:userId" element={<ConcursSubmitAnswers />} />
                <Route path="/concurs-winner/:groupId" element={<ConcursWinner />} />
            </Routes>
        </Router>
    );
}

export default App;


































