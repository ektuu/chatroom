import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure to create this file for styling

function App() {
    const [modelImageFile, setModelImageFile] = useState(null); // State to store model image file
    const [garmentImageUrl, setGarmentImageUrl] = useState(''); // State to store garment image URL
    const [outputImageUrl, setOutputImageUrl] = useState(''); // State to store processed output image URL
    const [error, setError] = useState(null); // State to store error messages
    const [loading, setLoading] = useState(false); // State to manage loading state

    useEffect(() => {
        // Extract garmentImageUrl from query parameters on component mount
        const urlParams = new URLSearchParams(window.location.search);
        const garmentUrlFromParams = urlParams.get('garmentImageUrl');
        if (garmentUrlFromParams) {
            setGarmentImageUrl(decodeURIComponent(garmentUrlFromParams));
        }
    }, []);

    // Function to handle using the user's profile image
    const handleUseProfileImage = () => {
        // Logic to fetch and set the user's profile image
        // This is a placeholder and should be replaced with actual logic
        const userProfileImage = 'url-to-user-profile-image.jpg'; // Replace with actual logic
        fetch(userProfileImage)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "profileImage.jpg", { type: "image/jpeg" });
                setModelImageFile(file);
            });
    };

    // Function to handle form submission
    const handleSubmit = async(event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        // Create FormData object to send model image file and garment image URL
        const formData = new FormData();
        formData.append('modelImage', modelImageFile);
        formData.append('garmentImageUrl', garmentImageUrl);

        try {
            // Send POST request to backend with FormData
            const response = await axios.post('http://localhost:5000/process-images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for FormData
                },
            });

            // Update output image URL in state
            setOutputImageUrl(response.data.outputImageUrl);
        } catch (err) {
            setError(err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle sharing the output image and navigating to another page
    const handleShareImage = () => {
        // Replace '/path-to-new-page' with the actual URL of the page you want to navigate to
        window.location.href = '/path-to-new-page';
    };

    return ( <
        div className = "App" >
        <
        h1 > Virtual Try - On < /h1> <
        form onSubmit = { handleSubmit } >
        <
        div className = "input-group" >
        <
        button type = "button"
        onClick = { handleUseProfileImage } > Use Your Own Profile Image < /button> <
        button type = "button"
        onClick = {
            () => document.getElementById('modelImage').click()
        } > Add Another Photo < /button> <
        input type = "file"
        id = "modelImage"
        onChange = {
            (e) => setModelImageFile(e.target.files[0])
        }
        accept = ".jpg,.jpeg,.png"
        style = {
            { display: 'none' }
        } // Hide the file input
        /> < /
        div > <
        div className = "input-group" >
        <
        label htmlFor = "garmentImageUrl" > < /label> <
        input type = "text"
        id = "garmentImageUrl"
        value = { garmentImageUrl }
        onChange = {
            (e) => setGarmentImageUrl(e.target.value)
        }
        required style = {
            { display: 'none' }
        } // Hide the input field
        /> < /
        div > <
        button type = "submit"
        disabled = { loading } > { loading ? 'Processing...' : 'Upload and Process' } <
        /button> < /
        form >

        {
            error && < p className = "error" > Error: { error } < /p>}

            <
            div className = "image-container" > {
                modelImageFile && ( <
                    div className = "image-box" >
                    <
                    h2 > Model Image < /h2> <
                    img src = { URL.createObjectURL(modelImageFile) }
                    alt = "Model" / >
                    <
                    /div>
                )
            }

            {
                garmentImageUrl && ( <
                    div className = "image-box" >
                    <
                    h2 > Garment Image < /h2> <
                    img src = { garmentImageUrl }
                    alt = "Garment" / >
                    <
                    /div>
                )
            }

            {
                outputImageUrl && ( <
                    div className = "image-box" >
                    <
                    h2 > Output Image < /h2> <
                    img src = { outputImageUrl }
                    alt = "Output" / >
                    <
                    button className = "share-button"
                    onClick = { handleShareImage } >
                    Go to Another Page <
                    /button> < /
                    div >
                )
            } <
            /div> < /
            div >
        );
    }

    export default App;