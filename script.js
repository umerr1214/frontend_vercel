document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const uploadText = document.getElementById('uploadText');
    const classifyBtn = document.getElementById('classifyBtn');
    const result = document.getElementById('result');
    const predictedFruit = document.getElementById('predictedFruit');
    const confidence = document.getElementById('confidence');
    const loading = document.getElementById('loading');

    // API endpoint (update this with your Railway backend URL)
    const API_URL = 'https://backendrailway-production-e7ec.up.railway.app';

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });

    // Handle click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
    });

    // Handle file selection
    function handleFile(file) {
        if (!file) return;
        
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            uploadText.classList.add('hidden');
            classifyBtn.classList.remove('hidden');
        };
        reader.readAsDataURL(file);

        // Store the file for later use
        classifyBtn.file = file;
    }

    // Handle classification
    classifyBtn.addEventListener('click', async () => {
        if (!classifyBtn.file) return;

        try {
            // Show loading state
            loading.classList.remove('hidden');
            result.classList.add('hidden');
            classifyBtn.disabled = true;

            // Prepare form data
            const formData = new FormData();
            formData.append('image', classifyBtn.file);

            // Send request to API
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to classify image');
            }

            const data = await response.json();

            // Display results
            predictedFruit.textContent = data.predicted_class;
            confidence.textContent = `${(data.confidence * 100).toFixed(2)}%`;
            result.classList.remove('hidden');

        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            loading.classList.add('hidden');
            classifyBtn.disabled = false;
        }
    });
}); 