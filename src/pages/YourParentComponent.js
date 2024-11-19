// YourParentComponent.js

import React, { useState } from "react";
import { useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from "../components/Navbar";
import PublisherPage from "../components/PublisherPage";
import DeveloperPage from "../components/DeveloperPage";
import UserPage from "../components/UserPage";
import Categories from "../components/Categories";
import Recomended from "../components/Recomended";
import DiscountCount from "../components/DiscountCount";
import SpecialOffer from "../components/SpecialOffer";
import Register from '../components/Register';

const YourParentComponent = () => {
  const [selectedUserType, setSelectedUserType] = useState(null);
  const navigate = useNavigate();

  const handleUserTypeSelected = (userType) => {
    setSelectedUserType(userType);
    
    switch(userType) {
      case 'publisher':
        navigate('/PublisherPage');
        break;
      case 'developer':
        navigate('/DeveloperPage');
        break;
      case 'user':
        navigate('/UserPage');
        break;
      default:
        navigate('/');
    }
  };

  const renderUserContent = () => {
    if (selectedUserType === 'user') {
      return (
        <div className="lg:max-w-[90vw] xl:max-w-[80vw] mx-auto">
          <Categories />
          <Recomended />
          <div className="my-6">
            <DiscountCount />
          </div>
          <SpecialOffer />
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (!selectedUserType) {
      return (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-xl text-white">Please select a user type from the navbar</h2>
        </div>
      );
    }

    return (
      <>
        {renderUserContent()}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/PublisherPage" element={<PublisherPage />} />
          <Route path="/DeveloperPage" element={<DeveloperPage />} />
          <Route path="/UserPage" element={<UserPage />} />
        </Routes>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#1b2838]">
      <Navbar onUserTypeSelected={handleUserTypeSelected} />
      {renderContent()}
    </div>
  );
};

export default YourParentComponent;
