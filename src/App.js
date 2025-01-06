import React from "react";
import ChatApp from "./components/ChatApp";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <ChatApp />
    </div>
  );
}

export default App;