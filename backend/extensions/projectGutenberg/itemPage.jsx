import extension, { init } from "../../frontEndApi.js";
import "./itemPage.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function File() {
  const { mediaID } = useParams(); // Get `mediaID` from the URL parameters
  const [item, setItem] = useState(null); // State for the fetched item
  const navigate = useNavigate(); // In case you need navigation functionality

  // Initialize the extension (runs once when the component mounts)
  useEffect(() => {
    init("projectGutenberg");
  }, []);

  // Fetch data when the component mounts or `mediaID` changes
  useEffect(() => {
    if (mediaID) {
      fetch(`http://localhost:3000/library/_/${mediaID}`)
        .then((res) => res.json())
        .then((json) => {
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

  // Render the fetched data
  return (
    <div>
      <h1>{item.title}</h1>
      <img src={item.cover}></img>
      <p>{item.summary}</p>
      <a href={item.web}>Read Online</a>
      <br></br>
      <a href={item.plainText}>Download text</a>
    </div>
  );
}

export default File;