import React from "react";

const Categories = () => {
  return (
<div className="gradient mx-[2rem] pl-4 pr-2 mt-8 flex items-center justify-between rounded-full py-[0.1rem]">
  <ul className="flex items-center py-1.5 text-black text-[14px] gap-10">
    <li>
      <a href="https://www.nfs.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
        Racing
      </a>
    </li>
    <li>
      <a href="https://www.callofduty.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
        Gun Games
      </a>
    </li>
    <li>
      <a href="https://store.steampowered.com/genre/Action/" target="_blank" rel="noopener noreferrer" className="hover:underline">
        Action
      </a>
    </li>
    <li>
      <a href="https://www.storygames.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
        Story
      </a>
    </li>
    <li>
      <a href="https://classicgamesarcade.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
        Classics
      </a>
    </li>
  </ul>
</div>

  );
};

export default Categories;
