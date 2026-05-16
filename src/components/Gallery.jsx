import "./Gallery.css";
import { useState } from "react";

function Gallery() {

  const imageData = [

    // Nature
    ...Array.from({ length: 30 }, (_, i) => ({
      url: `https://loremflickr.com/600/400/nature?random=${i + 1}`,
      category: "Nature"
    })),

    // Animals
    ...Array.from({ length: 30 }, (_, i) => ({
      url: `https://loremflickr.com/600/400/animal?random=${i + 101}`,
      category: "Animals"
    })),

    // Technology
    ...Array.from({ length: 30 }, (_, i) => ({
      url: `https://loremflickr.com/600/400/technology?random=${i + 201}`,
      category: "Technology"
    })),

    // Food
    ...Array.from({ length: 30 }, (_, i) => ({
      url: `https://loremflickr.com/600/400/food?random=${i + 301}`,
      category: "Food"
    }))

  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  const filteredImages =
    selectedCategory === "All"
      ? imageData
      : imageData.filter(
          (img) => img.category === selectedCategory
        );

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const downloadImage = async () => {

    const imageUrl = filteredImages[currentIndex].url;

    const response = await fetch(imageUrl);

    const blob = await response.blob();

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `image-${currentIndex}.jpg`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2000);

  };

  return (
    <>

      <div className="buttons">

        <button
          onClick={() => setSelectedCategory("All")}
          className={selectedCategory === "All" ? "active" : ""}
        >
          All
        </button>

        <button
          onClick={() => setSelectedCategory("Nature")}
          className={selectedCategory === "Nature" ? "active" : ""}
        >
          Nature
        </button>

        <button
          onClick={() => setSelectedCategory("Animals")}
          className={selectedCategory === "Animals" ? "active" : ""}
        >
          Animals
        </button>

        <button
          onClick={() => setSelectedCategory("Technology")}
          className={selectedCategory === "Technology" ? "active" : ""}
        >
          Technology
        </button>

        <button
          onClick={() => setSelectedCategory("Food")}
          className={selectedCategory === "Food" ? "active" : ""}
        >
          Food
        </button>

      </div>

      <div className="gallery">

        {filteredImages.map((img, index) => (

          <div className="card" key={index}>

            <img
              src={img.url}
              alt="gallery"
              onClick={() => setCurrentIndex(index)}
            />

          </div>

        ))}

      </div>

      {currentIndex !== null && (

        <div className="lightbox">

          <span
            className="close"
            onClick={() => setCurrentIndex(null)}
          >
            ×
          </span>

          <button
            className="prev"
            onClick={prevImage}
          >
            ❮
          </button>

          <img
            src={filteredImages[currentIndex].url}
            alt="big"
            className="lightbox-img"
          />

          <button
            className="next"
            onClick={nextImage}
          >
            ❯
          </button>

          <button
            className="download-btn"
            onClick={downloadImage}
          >
            Download
          </button>

        </div>

      )}

      {showMessage && (
        <div className="download-message">
          Image Downloaded Successfully ✅
        </div>
      )}

    </>
  );
}

export default Gallery;