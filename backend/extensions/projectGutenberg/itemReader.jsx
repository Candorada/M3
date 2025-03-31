import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./itemReader.css";

function File() {
  const [plainText, setPlainText] = useState(null);
  const { mediaID } = useParams();

  useEffect(() => {
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

        const response = await fetch(
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
    <div class="container">
      <pre class="text">{plainText ? plainText : "Loading..."}</pre>
    </div>
  );
}

export default File;
