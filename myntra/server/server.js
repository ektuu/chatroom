const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

let processedOutputUrl = ''; // Variable to store processed output URL

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads'); // Destination folder for uploaded files
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); // Use original file name
    }
});
const upload = multer({ storage: storage });

// Function to convert a local file to a base64-encoded string
function fileToBase64(filePath) {
    try {
        const data = fs.readFileSync(filePath);
        return data: $ { path.extname(filePath).slice(1) };
        base64, $ { data.toString('base64') };
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

// Function to run virtual try-on using Replicate
async function runVirtualTryOn(garmImgUrl, humanImgUrl, garmentDesc) {
    const input = {
        garm_img: garmImgUrl,
        human_img: humanImgUrl,
        garment_des: garmentDesc
    };

    console.log('Input to Replicate:', input); // Log input for debugging

    try {
        const output = await replicate.run(
            "cuuupid/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f", { input }
        );
        return output; // Assuming output_url is provided by Replicate
    } catch (error) {
        console.error('Error running the model:', error);
        throw error;
    }
}

// POST endpoint to process images and run virtual try-on
app.post('/process-images', upload.single('modelImage'), async(req, res) => {
    console.log('Received request'); // Log when request is received

    const { garmentImageUrl } = req.body;
    const modelImageFilePath = req.file.path; // Path to uploaded model image

    if (modelImageFilePath && garmentImageUrl) {
        try {
            const garmentDesc = "cute pink top"; // Update with actual garment description

            // Convert model image file to base64
            const modelImgBase64 = fileToBase64(modelImageFilePath);

            // Run virtual try-on
            const result = await runVirtualTryOn(garmentImageUrl, modelImgBase64, garmentDesc);
            processedOutputUrl = result; // Store processed output URL
            // const Replicate = require("replicate");

            // const replicate = new Replicate({
            //     auth: process.env.REPLICATE_API_TOKEN
            // });

            // const input = {
            //     prompt: "in snow forest",
            //     image_path: "https://replicate.delivery/pbxt/IbHG1WyjNvorekDSUCfLvGKkSyKf4PmTSBbf7aL5wnJY2Nco/car2.jpg"
            // };

            // async function checkImage() {
            //     try {
            //         const output = await replicate.run("mridul-ai-217/image-inpainting:a0b0f5837d27fc4a293c5e259062ae41eed5310301981387864fd15043c9c6aa", { input });
            //         console.log(output); // This will log the output URL or the result object
            //     } catch (error) {
            //         console.error("Error running the Replicate API:", error);
            //     }
            // }

            // checkImage();
            console.log('Processing complete');
            console.log(processedOutputUrl); // Log when processing is complete

            // Respond with processed output URL
            res.json({
                message: 'Images received and processed successfully',
                modelImageUrl: req.file.originalname,
                garmentImageUrl: garmentImageUrl,
                outputImageUrl: processedOutputUrl // Send processed output URL
            });
        } catch (error) {
            console.error('Error processing images:', error);
            res.status(500).json({ error: 'Error processing images' });
        }
    } else {
        res.status(400).json({ error: 'Please provide both model image file and garment image URL' });
    }
});

// GET endpoint to retrieve processed output URL
app.get('/processed-output-url', (req, res) => {
    res.json({ outputImageUrl: processedOutputUrl });
});

// Add a simple route to handle GET requests to the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Virtual Try-On Room API');
});

app.listen(port, () => {
            console.log(Server running on http: //localhost:${port});
            });