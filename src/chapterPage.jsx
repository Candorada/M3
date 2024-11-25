import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./chapterPage.css";
function ChapterPage() {
  const { mediaID, chapterID } = useParams();
  let [images, setImages] = useState([]);
  let [comicData, setComicData] = useState({});
  useEffect(() => {
    fetch(
      `http://localhost:3000/library/comics/${mediaID}/getchapter?chapterID=${chapterID}`,
    )
      .then((r) => r.json())
      .then((r) => setImages(r));
    fetch(`http://localhost:3000/library/comics/${mediaID}`)
      .then((r) => r.json())
      .then((r) => setComicData(r));
  }, []);
  return (
    <>
      <div className="ScrollboxComicReader">
        {images.map((img, i) => (
          <img
            className="comicPage"
            key={i}
            src={`http://localhost:3000/imageProxy?url=${img}&referer=${comicData.source || ""}`}
          ></img>
        ))}
      </div>
    </>
  );
}
export default ChapterPage;

