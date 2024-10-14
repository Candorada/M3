import React, { useState, useEffect } from "react";
import "./style.css";

function Extension({ extension }) {
  return (
    <div className="extension">
      <label>{extension.name}</label>
    </div>
  );
}

function ExtensionsPage() {
  const [extensions, setExtensions] = useState([
    { name: "SoundCloud" },
    { name: "GitHub" },
    { name: "youtube" },
  ]);

  useEffect(() => {
    fetch("http://localhost:3000/extensionList")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched extensions
        setExtensions(
          data.map((extension) => ({
            name: extension,
          })),
        );
      })
      .catch((error) => console.error("Error fetching array:", error));
  });

  return (
    <>
      {extensions.map((ex, index) => (
        <Extension key={index} extension={ex} />
      ))}
    </>
  );
}

export default ExtensionsPage;

