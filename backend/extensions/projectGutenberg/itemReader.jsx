import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./itemReader.css";

function File() {
  const [plainText, setPlainText] = useState(null);
  const { mediaID } = useParams();

  useEffect(() => {
    async function waitForFile(url, timeout = 10000, interval = 1000) {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        const res = await fetch(url);
        if (res.ok) return res;
        await new Promise((r) => setTimeout(r, interval));
      }
      throw new Error("File not available after waiting.");
    }

    //download and display text
    async function fetchText() {
      try {
        await fetch("http://localhost:3000/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            media_id: mediaID,
            referer: "https://www.gutenberg.org",
            column: "plainText",
          }),
        });

        const response = await waitForFile(
          `http://localhost:3000/textfile/${mediaID}`,
        );
        const text = await response.text();
        setPlainText(text);
      } catch (error) {
        console.error("Error fetching text file:", error);
      }
    }

    fetchText();
  }, []);

  return (
    <div className="container">
      <pre className="text">{plainText ? plainText : "Loading..."}</pre>
    </div>
  );
}

export default File;
