import { useState } from "react";
import SideNav from "./SideNavBar";
import Library from "./library";
import "./App.css"
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SideNav />
      <Library />
    </>
  );
}

export default App;
