import React, { useState, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import './App.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let interval;

    if (isAnimating) {
      interval = setInterval(() => {
        const newImages = images.map((image) => {
          let updatedImage = { ...image };
          updatedImage.y -= 1 * speed;

          if (updatedImage.y <= -250) {
            updatedImage = {
              ...updatedImage,
              y: window.innerHeight,
              x: Math.random() * (window.innerWidth - 200),
            };
          }

          return updatedImage;
        });
        setImages(newImages);
      }, 10);
    }

    return () => {
      clearInterval(interval);
    };
  }, [images, isAnimating, speed]);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => {
        const newImage = {
          img: img,
          x: Math.random() * (window.innerWidth - 200),
          y: window.innerHeight,
        };

        const isOverlap = images.some((image) => {
          const distance = Math.sqrt(
            Math.pow(newImage.x - image.x, 2) + Math.pow(newImage.y - image.y, 2)
          );
          return distance < 250; // Check if the distance is less than the sum of image heights
        });

        if (!isOverlap) {
          setImages([...images, newImage]);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleToggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  const handleImageDoubleClick = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  return (
    <div className="App" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="controls">
        <button onClick={handleToggleAnimation}>{isAnimating ? 'Detener' : 'Iniciar'}</button>
        <label htmlFor="speed">Velocidad:</label>
        <input
          type="range"
          id="speed"
          min={0.1}
          max={10}
          step={0.1}
          value={speed}
          onChange={handleSpeedChange}
        />
      </div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {images.map((image, index) => (
            <Image
              key={index}
              image={image.img}
              x={image.x}
              y={image.y}
              width={150}
              height={250}
              draggable
              onDragEnd={(e) => {
                const newImages = [...images];
                newImages[index].x = e.target.x();
                newImages[index].y = e.target.y();
                setImages(newImages);
              }}
              onDblClick={() => handleImageDoubleClick(index)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
