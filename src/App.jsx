import { useEffect, useState } from "react";
import SideNav from "./SideNavBar";
import Library from "./library";
import ExtensionsPage from "./extensionsUI/extenisonsUI";
import ExtensionPage from "./extensionsUI/ExtensionPage/extensionpage"
import ItemPage from  "./libraryItemPage"
import ChapterPage from "./chapterPage";
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
    path: "/library/:mediaID/:chapterID",
    element: <ChapterPage />
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
  let [backButton,setBackButton] = useState()
  useEffect(()=>{
    setBackButton((()=>{
      let route = sideNavRouter.state.matches[0].route.path
      console.log(route)
      if(route == "/library/:mediaID" ||route=="/library/:mediaID/:chapterID"){
        return (<input type="button" value = "< back" className="backButton"
          onClick={()=>{
            sideNavRouter.navigate("./..")
          }} />)
      }
    return <SideNav selected={window.location.href.split(/(?<!\/)\/(?!\/)/)[1]}/>
    })())
  })
  return (
    <>
    {
      backButton
    }
      <div id = "currentPage">
      <RouterProvider router = {sideNavRouter}/>
      </div>
    </>
  );
}

export default App;
