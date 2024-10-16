import React, { useState, useEffect } from "react";
import "./style.css";

function Extension({ extension }) {
  return (
    <a href={"extensions/" + extension.id}>
      <div className="extension">
        <img src={extension.img} alt="" />
        <label>{extension.name}</label>
      </div>
    </a>
  );
}
function ExtensionsPage() {
  const [extensions, setExtensions] = useState([]);
  var selectedFile = null;
  function updateExtensionList() {
    fetch("http://localhost:3000/extensionList")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched extensions
        setExtensions(
          Object.keys(data).map((id) => ({
            //id stands for extension ID aka the folder name
            id: id,
            name: data[id].properties.name,
            img: data[id].properties.iconPath
              ? (data[id].properties.iconPath.match(/^http/)
                  ? ""
                  : "../../backend/extensions/" + id + "/") +
                data[id].properties.iconPath
              : "./src/extensionsUI/Error.jpg", // dont think too hard about this. its confusing
          })),
        );
      })
      .catch((error) => console.error("Error fetching array:", error));
  }
  const downloadExtension = async (e) => {
    e.preventDefault();
    selectedFile = e.dataTransfer.files[0];
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("http://localhost:3000/downloadExtension", {
      method: "POST",
      body: formData,
    }).then(updateExtensionList);
    if (response.ok) {
      console.log("File uploaded successfully");
    } else {
      console.log("Error uploading file");
    }
  };

  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/button-press", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Button pressed" }),
      });

      const data = await response.json();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    updateExtensionList();
  }, []);
  return (
    <>
      <div
        id="extensionListHolder"
        onDrop={downloadExtension}
        onDragOver={(e) => e.preventDefault()}
      >
        {extensions.map((extension) => (
          <Extension key={extension.id} extension={extension} />
        ))}
        <button className="deleteButton" onClick={handleClick}>
          delete
        </button>
      </div>
    </>
  );
}

export default ExtensionsPage;
