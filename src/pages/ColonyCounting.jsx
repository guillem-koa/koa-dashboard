import React, { useState } from 'react';

const ColonyCounting = () => {
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
                <h2> Colony Counting on LB Agar 🧫</h2>
                <div class="info-box" style={{ marginLeft: '50px' }}>
                    <p>
                        Upload a <strong> picture of a single LB agar plate</strong>. The app outputs the same picture with boxes surrounding colonies.
                        On the top of the image you get the sum of all colonies.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ marginLeft: '50px' }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <button class="btn" type="submit" disabled={loading} style={{ marginLeft: '100px' }}>
                        {loading ? 'Processing...' : 'Submit'}
                    </button>
                </form>

                {resultImage && (
                    <div>
                        <h2>Result Image 🔬</h2>
                        <img src={resultImage} alt="Processed result" style={{
                            maxWidth: '70%', height: 'auto', display: 'block', // Ensure the image is treated as a block element
                            margin: '0 auto', // Center the image horizontally 
                        }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColonyCounting;
