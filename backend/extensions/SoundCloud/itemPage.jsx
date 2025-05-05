import extension, { init } from "../../frontEndApi.js";
import "./itemPage.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function File() {
  const { mediaID } = useParams(); // Get `mediaID` from the URL parameters
  const [item, setItem] = useState(null); // State for the fetched item
  const navigate = useNavigate(); // In case you need navigation functionality
  const [url,setUrl] = useState("");
  const [isDownloaded,setIsDownloaded] = useState(false);
  // Initialize the extension (runs once when the component mounts)
  useEffect(() => {
    if(item?.extension){
      init(item)
    }
  }, [item]);

  // Fetch data when the component mounts or `mediaID` changes
  useEffect(()=>{
    (async ()=>{
      if(item){
        let x = extension.run("getTrackFileURL",[item.source]);
        setUrl(await x);
          let is = await extension.run("isDownloaded",[mediaID]);
          setIsDownloaded(is);
      }
    })()

  },[item])
  useEffect(() => {
    if (mediaID) {
      fetch(`http://localhost:3000/library/_/${mediaID}`)
        .then((res) => res.json())
        .then((json) => {
          console.log(json)
          setItem(json); // Update the state with fetched data
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [mediaID]);
  // Render loading state if data is not yet fetched
  if (!item) {
    return <p>Loading...</p>;
  }

  async function handleDownload(e,[URL,id]) {
    e.preventDefault();
    if(isDownloaded){
      let returnValue = await extension.run("deleteSong",[id]);
      console.log(returnValue)
      if(returnValue){
        setIsDownloaded(false);
      }
    }else{
      let returnValue = await extension.run("downloadFile",[URL,id]);
      if(returnValue){
        setIsDownloaded(true);
      }
    }
  }
  // Render the fetched data
  return (
    <div>
      <h1>{item.title}</h1>
      <img src={item.cover}></img>
      <p>{item.about}</p>
      <br></br>
      <div>{url.url}</div>
      <button onClick={(e)=>{handleDownload(e,[item.source,item.id])}}>{isDownloaded?"Delete":"Download"}</button>
    </div>
  );
}

export default File;
