import "./Gallery.css";
import { useState, useEffect } from "react";

function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_KEY = "VGLxxvqB2xyDy2lfHVfCysg6eb7W0peIQbYxLru28RP1q9BO6gzHivF6";

  const fetchImages = async (query) => {
    setLoading(true);
    // Random page 1 se 5 tak taake har dafa naye results milen
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const url = query === "All" 
      ? `https://api.pexels.com/v1/curated?per_page=80&page=${randomPage}` 
      : `https://api.pexels.com/v1/search?query=${query}&per_page=80&page=${randomPage}`;

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

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const downloadImage = async () => {
    const imageUrl = images[currentIndex].src.original;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `image-${currentIndex}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <>
      <div className="buttons">
        {["All", "Nature", "Animals", "Technology", "Food"].map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={selectedCategory === cat ? "active" : ""}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="gallery">
          {images.map((img, index) => (
            <div className="card" key={img.id}>
              <img src={img.src.medium} alt={img.alt} onClick={() => setCurrentIndex(index)} />
            </div>
          ))}
        </div>
      )}

      {currentIndex !== null && (
        <div className="lightbox">
          <span className="close" onClick={() => setCurrentIndex(null)}>×</span>
          <button className="prev" onClick={prevImage}>❮</button>
          <img src={images[currentIndex].src.large} alt="big" className="lightbox-img" />
          <button className="next" onClick={nextImage}>❯</button>
          <button className="download-btn" onClick={downloadImage}>Download</button>
        </div>
      )}

      {showMessage && <div className="download-message">Image Downloaded Successfully ✅</div>}
    </>
  );
}

export default Gallery;