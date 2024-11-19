// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Categories from './components/Categories';
// import Navbar from './components/Navbar';
// import Recomended from './components/Recomended';
// import SpecialOffer from './components/SpecialOffer';
// import DeveloperPage from './components/DeveloperPage';
// import PublisherPage from './components/PublisherPage';
// import DiscountCount from './components/DiscountCount';

// function App() {
//   return (
//     <Router>
//       <div className="bg-[#1b2838]">
//         {/* Navbar */}
//         <Navbar />
//         <div className="lg:max-w-[90vw] xl:max-w-[80vw] mx-auto">
//           {/* Categories */}
//           <Categories />
//           {/* Recommended */}
//           <Recomended />
          
//           {/* Discount Count */}
//           <div className="my-6">
//             <DiscountCount />
//           </div>
          
//           {/* SpecialOffers */}
//           <SpecialOffer />

//           {/* Routes for DeveloperPage and PublisherPage */}
//           <Routes>
//             <Route path="/DeveloperPage" element={<DeveloperPage />} />
//             <Route path="/PublisherPage" element={<PublisherPage />} />
//           </Routes>
//         </div>
//         {/* Browse */}
//         {/* Footer */}
//       </div>
//     </Router>
//   );
// }

// export default App;



// import React from "react";
// import DeveloperPage from "./components/DeveloperPage";

// function App() {
//   return (
//     <div>
//       {/* Render only DeveloperPage */}
//       <DeveloperPage />
//     </div>
//   );
// }
// export default App;





// import React from "react";
// import PublisherPage from "./components/PublisherPage";

// function App() {
//   return (
//     <div>
//       {/* Render only PublisherPage */}
//       <PublisherPage />
//     </div>
//   );
// }
// export default App;





// import React from "react";
// import UserPage from "./components/UserPage";

// function App() {
//   return (
//     <div>
//       {/* Render only UserPage */}
//       <UserPage />
//     </div>
//   );
// }
// export default App;




import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import YourParentComponent from "./pages/YourParentComponent";

function App() {
  return (
    <Router>
      <YourParentComponent />
    </Router>
  );
}

export default App;