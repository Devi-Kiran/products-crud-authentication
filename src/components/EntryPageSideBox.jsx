import React from "react";
import { BsFillPlayFill } from "react-icons/bs";

function EntryPageSideBox() {
  return (
    <div className="hidden md:flex justify-center items-center h-screen w-2/4 bg-gradient-to-bl from-brandColor to-black">
      <div className="bg-white  p-6 rounded-xl">
        <p className="text-4xl font-bold leading-20">
          <BsFillPlayFill />
          Products
          <br />
          platform
          <br />
          for stock
          <br />
          <span className="text-brandColor">managament</span>
        </p>
      </div>
    </div>
  );
}

export default EntryPageSideBox;
