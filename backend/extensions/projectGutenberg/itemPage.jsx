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
  return(
  <div className="item-wrapper">
    <h1>{item.overhead}</h1>
    <div className="item-container">
      <div className="image-section">
        <img src={item.cover} alt={item.title} />
        <a href={item.source} className="source-link">Source</a>
      </div>
      <div className="item-details">
        <p>{item.summary}</p>
      
        <table className="table">
          <thead>
            <tr>
              <th>Choose how you want to read</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href={item.web}>Read Online</a></td>
            </tr>
            <tr>
              <td><a href={item.EPUB}>EPUB3 file</a></td>
            </tr>
            <tr>
              <td>
                <a href="#/" onClick={(e) => handleDownload(e, "plainText")}>
                  Download text
                </a>
              </td>
            </tr>
            <tr>
              <td><a href={item.HTML}>Download HTML (zip)</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}

export default File;
