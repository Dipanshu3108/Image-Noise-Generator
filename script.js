import { addGaussianNoise, addUniformNoise, addExponentialNoise, addGammaNoise } from './noises.js';

document.addEventListener('DOMContentLoaded', function () {
    // State variables
    let selectedNoise = null;
    let uploadedImage = null;
    let processedImage = null;
    const MAX_DISPLAY_WIDTH = 800; 
    const MAX_DISPLAY_HEIGHT = 600; 

    // DOM Elements
    const imageInput = document.getElementById('imageInput');
    const previewBox = document.getElementById('previewBox');
    const outputBox = document.getElementById('outputBox');
    const processBtn = document.getElementById('processBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const noiseList = document.getElementById('noiseList');
    const removeImageBtn = document.getElementById('removeImage');
    const uploadContent = document.getElementById('uploadContent');

    // Initialize UI state
    if (downloadBtn) {
        downloadBtn.style.display = 'none';
    }

    function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
        const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        return {
            width: srcWidth * ratio,
            height: srcHeight * ratio
        };
    }

    function resizeImage(imgElement) {
        return new Promise((resolve) => {
            // Create a temporary canvas for resizing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate new dimensions
            const dimensions = calculateAspectRatioFit(
                imgElement.naturalWidth,
                imgElement.naturalHeight,
                MAX_DISPLAY_WIDTH,
                MAX_DISPLAY_HEIGHT
            );

            // Set canvas dimensions to the resized values
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            // Draw the resized image
            ctx.drawImage(imgElement, 0, 0, dimensions.width, dimensions.height);

            // Convert to data URL
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            resolve(resizedDataUrl);
        });
    }

    function handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = async function() {
                // Resize the image if it exceeds maximum dimensions
                if (img.naturalWidth > MAX_DISPLAY_WIDTH || img.naturalHeight > MAX_DISPLAY_HEIGHT) {
                    uploadedImage = await resizeImage(img);
                } else {
                    uploadedImage = event.target.result;
                }
                displayUploadedImage(uploadedImage);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function displayUploadedImage(imageSrc) {
        previewBox.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'image-container';

        const img = document.createElement('img');
        img.src = imageSrc;
        container.appendChild(img);


        previewBox.appendChild(container);

        // Adjust preview box size based on image dimensions
        img.onload = function() {
            const boxSize = Math.max(img.offsetHeight, img.offsetWidth) + 40; // Add padding
            previewBox.style.height = `${Math.min(boxSize, MAX_DISPLAY_HEIGHT)}px`;
            outputBox.style.height = previewBox.style.height;
        };
    }

    function resetUpload() {
        // Reset all state variables
        uploadedImage = null;
        processedImage = null;
        
        // Reset preview box
        previewBox.innerHTML = '';
        previewBox.appendChild(uploadContent);
        
        // Reset output box
        outputBox.innerHTML = 'Processed image will appear here';
        
        // Reset preview and output boxes to default height
        previewBox.style.height = '400px';
        outputBox.style.height = '400px';
        
        // Hide download button
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
        
        // Reset file input
        if (imageInput) {
            imageInput.value = '';
        }
    
        // Reset noise selection
        if (noiseList) {
            noiseList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
        }
        selectedNoise = null;
    }

    // Event Listeners
    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });
    }

    if (previewBox) {
        previewBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            previewBox.classList.add('dragover');
        });

        previewBox.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            previewBox.classList.remove('dragover');
        });

        previewBox.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            previewBox.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });
    }

    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', function () {
            resetUpload();
        });
    }

    if (noiseList) {
        noiseList.addEventListener('click', function (e) {
            if (e.target.tagName === 'LI') {
                noiseList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                e.target.classList.add('selected');
                selectedNoise = e.target.dataset.noise;
            }
        });
    }

    if (processBtn) {
        processBtn.addEventListener('click', function () {
            if (!uploadedImage) {
                alert('Please upload an image first!');
                return;
            }
            if (!selectedNoise) {
                alert('Please select a noise effect!');
                return;
            }

            processImage(uploadedImage, selectedNoise);
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            if (processedImage) {
                downloadImage(processedImage);
            }
        });
    }

    function processImage(image, noiseType) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            switch (noiseType) {
                case 'gaussian':
                    addGaussianNoise(imageData);
                    break;
                case 'uniform':
                    addUniformNoise(imageData);
                    break;
                case 'exponential':
                    addExponentialNoise(imageData);
                    break;
                case 'gamma':
                    addGammaNoise(imageData);
                    break;
                default:
                    alert('Unknown noise type!');
                    return;
            }
            
            context.putImageData(imageData, 0, 0);
            processedImage = canvas.toDataURL('image/png');
            displayProcessedImage(processedImage);
        };
        
        img.onerror = function () {
            alert('Failed to load the image. Please try again with a valid image file.');
        };
        
        img.src = image;
    }

    function displayProcessedImage(processedImageUrl) {
        outputBox.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'image-container';

        const img = document.createElement('img');
        img.src = processedImageUrl;
        container.appendChild(img);
        
        outputBox.appendChild(container);
        
        if (downloadBtn) {
            downloadBtn.style.display = 'block';
        }
    }

    function downloadImage(imageUrl) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'processed-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});