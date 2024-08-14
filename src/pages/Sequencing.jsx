import React, { useState } from 'react';

const Sequencing = () => {
    const [image, setImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!image) {
            alert("Please select an image.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await fetch('http://37.187.176.243:8001/LAB_colony_counting_on_lb', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setResultImage(url);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="container">
        <div class="content">
          <h2> Sequencing 🧬</h2>
          <p> In development...</p>
        </div>
        </div>
    );
};

export default Sequencing;
