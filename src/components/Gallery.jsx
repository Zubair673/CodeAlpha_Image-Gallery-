import "./Gallery.css";
import { useState, useEffect } from "react";

function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "VGLxxvqB2xyDy2lfHVfCysg6eb7W0peIQbYxLru28RP1q9BO6gzHivF6";

  const fetchImages = async (query) => {
    setLoading(true);
    const url = query === "All" 
      ? "https://api.pexels.com/v1/curated?per_page=80" 
      : `https://api.pexels.com/v1/search?query=${query}&per_page=80`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: API_KEY }
      });
      const data = await response.json();
      setImages(data.photos);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <div className="buttons">
        {["All", "Nature", "Animals", "Technology", "Food"].map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={selectedCategory === cat ? "active" : ""}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading Relevant Images...</div>
      ) : (
        <div className="gallery">
          {images.map((img, index) => (
            <div className="card" key={img.id}>
              <img src={img.src.medium} alt={img.alt} onClick={() => setCurrentIndex(index)} />
            </div>
          ))}
        </div>
      )}

      {currentIndex !== null && images[currentIndex] && (
        <div className="lightbox">
          <span className="close" onClick={() => setCurrentIndex(null)}>×</span>
          <img src={images[currentIndex].src.large2x} alt="big" className="lightbox-img" />
          <a href={images[currentIndex].url} target="_blank" rel="noreferrer" className="download-btn">View on Pexels</a>
        </div>
      )}
    </>
  );
}

export default Gallery;