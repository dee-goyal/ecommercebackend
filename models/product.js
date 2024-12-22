import React, { useState } from 'react';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState(['']);
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const product = { name, price, images, category, rating };

  try {
    const response = await fetch('https://yourapiurl.com/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    const data = await response.json();

    if (response.ok) {
      // Handle successful product creation
      console.log('Product created successfully:', data);
    } else {
      // Handle errors
      console.error('Failed to create product:', data);
    }
  } catch (error) {
    console.error('Error creating product:', error);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Product Price" />
      {images.map((image, index) => (
        <input
          key={index}
          type="text"
          value={image}
          onChange={(e) => handleImageChange(index, e.target.value)}
          placeholder="Image URL"
        />
      ))}
      <button type="button" onClick={addImageField}>Add Image</button>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" />
      <button type="submit">Create Product</button>
    </form>
  );
};

export default CreateProduct;
