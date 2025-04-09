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
        console.log(item.source)
        let x = extension.run("getTrackFileURL",[item.source]);
        console.log(await x)
        setUrl(await x);
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

  async function handleDownload(e, column) {
    e.preventDefault();

    await fetch("http://localhost:3000/download", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        media_id: mediaID,
        column: column,
        download: true,
      }),
    });
  }
  // Render the fetched data
  return (
    <div>
      <h1>{item.title}</h1>
      <img src={item.cover}></img>
      <p>{item.about}</p>
      <br></br>
      <div>{url.url}</div>
    </div>
  );
}

export default File;
