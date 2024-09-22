import { useState } from "react";
import SideNav from "./SideNavBar";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SideNav />
    </>
  );
}

export default App;
