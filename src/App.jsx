import { useState } from "react";
import SideNav from "./SideNavBar";
import Library from "./library";
import ExtensionsPage from "./extensionsUI/extenisonsUI";
import ExtensionPage from "./extensionsUI/ExtensionPage/extensionpage"
import ItemPage from  "./libraryItemPage"
import "./App.css"
import { Navigate,RouterProvider, createBrowserRouter} from "react-router-dom";
let sideNavRouter = createBrowserRouter([
  {
    errorElement: <div>Error 404 page not found <a href="/">return</a></div>,
  },{
    path: "/",
    element: <Navigate to="/library" />,
  },
  {
    path: "/library",
    element: <Library />
  },
  {
    path: "/library/:mediaID",
    element: <ItemPage />
  },
  {
    path: "/extensions",
    element: <ExtensionsPage />,
  },
  {
    path:"/extensions/:extension",
    element: <ExtensionPage />
  },
])
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <SideNav selected={window.location.href.split(/(?<!\/)\/(?!\/)/)[1]}/>
      <div id = "currentPage">
      <RouterProvider router = {sideNavRouter}/>
      </div>
    </>
  );
}

export default App;
