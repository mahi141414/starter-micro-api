const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const savedAudioDirectory = path.join(__dirname, 'saved_audio');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/generate', async (req, res) => {
    const apiKey = req.query.key;
    const prompt = req.query.prompt;

    if (!apiKey || !prompt) {
        return res.status(400).json({ error: "API key and prompt are required." });
    }

    if (apiKey === "sudiptoisgay") {
        try {
            const payload = {
                text: prompt,
            };

            const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/zrHiDhphv9ZnVXBqCLjz';
            const apiKey = 'e3bc9b24bf7240186872e8285125f85a';

            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                responseType: 'stream',
            });

            // Generate a random filename based on the current timestamp
            const timestamp = new Date().getTime();
            const mp3Filename = `output_${timestamp}.mp3`;
            const mp3Path = path.join(savedAudioDirectory, mp3Filename);

            response.data.pipe(fs.createWriteStream(mp3Path));

            response.data.on('end', () => {
                if (fs.existsSync(mp3Path)) {
                    res.status(200).sendFile(mp3Path);
                } else {
                    res.status(500).json({ error: "Failed to save MP3 file." });
                }
            });
        } catch (error) {
            res.status(500).json({ error: `Error processing response: ${error.message}` });
        }
    } else {
        res.status(401).json({ error: "Access denied! Invalid API key." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
