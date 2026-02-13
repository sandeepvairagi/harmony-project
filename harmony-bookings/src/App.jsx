import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'
import {Routes, Route} from "react-router-dom";
import OpenRoute from "./components/Auth/OpenRoute.jsx";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";
import UserDash from './pages/UserDashboard/UserDash';
import InstructorDash from './pages/InstructorDashboard/InstructorDash';
import FindInstructor from './pages/FindInstructor.jsx';
import InstructorBooking from './pages/Booking/InstructorBooking.jsx';
import AsanasLibrary from './pages/AsanasLibrary.jsx';
import HeatmapComponent from './pages/Heatmap/HeatmapComponent.jsx';
import CheckoutSuccess from './pages/Booking/CheckoutSuccess.jsx';

function App() {

  return (
    <div className='w-[100%] h-full font-poppins bg-gradient-to-r from-slate-100 to-slate-300 ' >
      <Header/>
      <div className='w-11/12 h-full mx-auto' >
         <Routes>
            <Route path='/' element={
                <Home/>
            } />
            <Route path='/home' element={
                <Home/>
            } />
            <Route path='/register' element={
              <OpenRoute>
                <Register/>
              </OpenRoute>
            } />
            <Route path='/login' element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            } />

          <Route path='/book-class/:id' element={
                <InstructorBooking />
            } />
          
          <Route path='/asanas-library' element={
                <AsanasLibrary />
            } />

          <Route path='/streak-map' element={
                <HeatmapComponent />
            } />

        <Route path='/checkout-success' element={
                        <CheckoutSuccess />
                    } />

          <Route path='/find-a-instructor' element={
                <FindInstructor />
            } />

          <Route path='/dashboard/user/my-profile' element={
                        <PrivateRoute>
                          <UserDash />
                        </PrivateRoute>
                      } />
          
          <Route path='/dashboard/instructor/my-profile' element={
                        <PrivateRoute>
                          <InstructorDash />
                        </PrivateRoute>
                      } />

         </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App
