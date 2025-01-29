import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import MenuCarousel from './components/Carousel';
import Logo from './components/Logo';
import CategoryButton from './components/CategoryButton';
import MenuSection from './components/MenuSection';
import AddDishes from './components/adminComponents/AddDishes';
import AdminHome from './components/adminComponents/AdminHome';


function HomePage() {
  return (
    <>
      <Logo />
      <MenuCarousel />
      <CategoryButton />
      <MenuSection />
    </>
  );
}

function AdminPage() {
  return (
    <>
      <Logo />
      <AdminHome />
    </>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
     
        <Route path="/admin" element={<AdminPage/>} />
        <Route path="/admin/add-dishes" element={<AddDishes/>} />
      </Routes>
    </Router>
  );
}

export default App;





// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import './App.css';
// import MenuCarousel from './components/Carousel';
// import Logo from './components/Logo';
// import CategoryButton from './components/CategoryButton';
// import MenuSection from './components/MenuSection';
// import AddDishes from './components/adminComponents/AddDishes';

// function HomePage() {
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulating an API call
//   useEffect(() => {
//     const fetchData = async () => {
//       // Simulate fetching data
//       setTimeout(() => {
//         setIsLoading(false); // Once data is fetched, set loading to false
//       }, 3000); // Simulating a 3-second API call
//     };

//     fetchData();
//   }, []);

//   return (
//     <>
//       {isLoading ? (
//         <Logo /> // Display the logo while loading
//       ) : (
//         <>
//           <Logo />
//           <MenuCarousel />
//           <CategoryButton />
//           <MenuSection />
//         </>
//       )}
//     </>
//   );
// }


// function AdminPage() {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setTimeout(() => {
//         setIsLoading(false); // Once data is fetched, set loading to false
//       }, 3000); // Simulating a 3-second API call
//     };

//     fetchData();
//   }, []);

//   return (
//     <>
//       {isLoading ? (
//         <Logo /> // Display the logo while loading
//       ) : (
//         <AddDishes />
//       )}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/admin/add-dishes" element={<AdminPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

