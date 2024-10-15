import React, { useState, useEffect } from "react";
import "./style.css";

function Extension({ extension }) {
  return (
    <div className="extension">
      <img src={extension.img} alt="" />
      <label>{extension.name}</label>
    </div>
  );
}

function ExtensionsPage() {
  const [extensions, setExtensions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/extensionList")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched extensions
        setExtensions(
          Object.keys(data).map((id) => ({ //id stands for extension ID aka the folder name
            id:id,
            name:data[id].properties.name,
            img:(data[id].properties.iconPath?(data[id].properties.iconPath.match(/^http/)?"":"../../backend/extensions/"+id+"/")+data[id].properties.iconPath:"./src/extensionsUI/Error.jpg") // dont think too hard about this. its confusing
          })),
        );
      })
      .catch((error) => console.error("Error fetching array:", error));
  },[]);
  return (
    <>
      {extensions.map((extension) => (
        <Extension key={extension.id} extension={extension} />
      ))}
    </>
  );
}

export default ExtensionsPage;

