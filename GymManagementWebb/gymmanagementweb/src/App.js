import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/Register";
import Login from "./components/Login";
import { MyDispatchContext, MyUserContext, AuthLoadingContext } from "./contexts/Contexts";
import { useEffect, useReducer, useState } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import GymPackageList from "./components/GymPackageList";
import ReviewList from "./components/review/ReviewList";
import AddReview from "./components/review/AddReview";
import EditReview from "./components/review/EditReview";
import { authApis, endpoints } from "./configs/Apis";
import { getValidToken, handleAuthError } from "./utils/authUtils";
import Schedule from "./components/Schedule";
import { ChatProvider } from "./contexts/ChatContext";
import ChatButton from "./components/chat/ChatButton";
import ChatPopup from "./components/chat/ChatPopup";
import DateTest from "./components/DateTest";
import ChatDemo from "./components/ChatDemo";
import ManagementGymPackageList from "./components/manager/ManagementGymPackageList";
import AddGymPackage from "./components/manager/AddGymPackage";
import EditGymPackage from "./components/manager/EditGymPackage";
import AddTrainingProgress from "./components/trainer/AddTrainingProgress";
import MySubscription from "./components/member/MySubscription";
import Statistic from "./components/manager/Statistics";
import TrainerDashboard from "./components/trainer/TrainerDashboard";
import MemberProgress from "./components/member/MemberProgress";
import TrainerScheduleView from "./components/trainer/TrainerScheduleView";
import GymPackageDetail from "./components/GymPackageDetail";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ROLES } from "./utils/roleUtils";
import CreateSubscription from "./components/CreateSubscription";
import PaymentResult from "./components/PaymentResult";


const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const token = getValidToken();
      if (token) {
        try {
          const res = await authApis().get(endpoints["current-user"]);
          console.log("User: " + JSON.stringify(res.data))

          // Kiểm tra response data có hợp lệ không
          if (res.data && res.data.id) {
            dispatch({ type: "login", payload: res.data });
          } else {
            throw new Error('Invalid user data');
          }
        } catch (error) {
          handleAuthError(error, dispatch);
        }
      }
      setIsAuthLoading(false);
    };
    getUser();
  }, []);

  return (
    <AuthLoadingContext.Provider value={isAuthLoading}>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <ChatProvider>
            <BrowserRouter>
              <Header />

              <Container>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/gym-packages" element={<GymPackageList />} />

                  {/* Admin/Manager only routes */}
                  <Route path="/gym-packages-mana" element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                      <ManagementGymPackageList />
                    </ProtectedRoute>
                  } />
                  <Route path="/gym-packages-mana/add" element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                      <AddGymPackage />
                    </ProtectedRoute>
                  } />
                  <Route path="/gym-packages-mana/edit/:id" element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                      <EditGymPackage />
                    </ProtectedRoute>
                  } />

                  {/* Trainer only routes */}
                  <Route path="/progress-create" element={
                    <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
                      <AddTrainingProgress />
                    </ProtectedRoute>
                  } />
                  <Route path="/trainer-progress" element={
                    <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
                      <TrainerDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/trainer-schedule-view" element={
                    <ProtectedRoute allowedRoles={[ROLES.TRAINER]}>
                      <TrainerScheduleView />
                    </ProtectedRoute>
                  } />

                  {/* Member only routes */}
                  <Route path="/member-progress" element={
                    <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
                      <MemberProgress />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-subscriptions" element={
                    <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
                      <MySubscription />
                    </ProtectedRoute>
                  } />

                  {/* Authenticated user routes */}
                  <Route path="/schedule/:id" element={
                    <ProtectedRoute>
                      <Schedule />
                    </ProtectedRoute>
                  } />
                  <Route path="/secure-reviews" element={
                    <ProtectedRoute>
                      <ReviewList />
                    </ProtectedRoute>
                  } />
                  <Route path="/add-review" element={
                    <ProtectedRoute>
                      <AddReview />
                    </ProtectedRoute>
                  } />
                  <Route path="/edit-review/:id" element={
                    <ProtectedRoute>
                      <EditReview />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-subscription" element={
                    <ProtectedRoute>
                      <CreateSubscription />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment/return" element={
                    <ProtectedRoute>
                      <PaymentResult />
                    </ProtectedRoute>
                  } />
                  <Route path="/packages/:id" element={<GymPackageDetail />} />
                  <Route path="/reviews/add" element={<AddReview />} />

                  {/* Admin only routes */}
                  <Route path="/statistics" element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Statistic />
                    </ProtectedRoute>
                  } />
                  <Route path="/chat-demo" element={
                    <ProtectedRoute>
                      <ChatDemo />
                    </ProtectedRoute>
                  } />
                  <Route path="/date-test" element={<DateTest />} />
                </Routes>
              </Container>
              <Footer />

              {/* Chat Components - chỉ hiển thị khi user đã đăng nhập */}
              {user && (
                <>
                  <ChatButton />
                  <ChatPopup />
                </>
              )}
            </BrowserRouter>
          </ChatProvider>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </AuthLoadingContext.Provider>
  );
}

export default App;
