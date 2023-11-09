import React from "react";
import loader from "../Images/icons8-book.gif";

const BookLoader = ({message}) => {
  return (
    <div>
      <div role="status" className="flex flex-col items-center text-center justify-center">
        <img src={loader}></img>
        <h3>{message || "Loading ..."}</h3>
      </div>
    </div>
  );
};

export default BookLoader;
