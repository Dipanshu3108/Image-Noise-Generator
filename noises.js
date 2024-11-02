// Gaussian Noise
function addGaussianNoise(imageData, mean = 0, std = 50) {  // Increased std for visibility
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const noise = std * (Math.random() - 0.5) + mean;
        pixels[i] = clamp(pixels[i] + noise);       // Red
        pixels[i + 1] = clamp(pixels[i + 1] + noise); // Green
        pixels[i + 2] = clamp(pixels[i + 2] + noise); // Blue
    }
}

// Uniform Noise
function addUniformNoise(imageData, low = -50, high = 50) {  // Increased range for visibility
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const noise = Math.random() * (high - low) + low;
        pixels[i] = clamp(pixels[i] + noise);
        pixels[i + 1] = clamp(pixels[i + 1] + noise);
        pixels[i + 2] = clamp(pixels[i + 2] + noise);
    }
}

// Exponential Noise
function addExponentialNoise(imageData, scale = 50) {  // Increased scale for visibility
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const noise = -scale * Math.log(Math.random());
        pixels[i] = clamp(pixels[i] + noise);
        pixels[i + 1] = clamp(pixels[i + 1] + noise);
        pixels[i + 2] = clamp(pixels[i + 2] + noise);
    }
}

// Gamma Noise
function addGammaNoise(imageData, shape = 2.0, scale = 30) {  // Increased scale for visibility
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const noise = scale * Math.pow(-Math.log(Math.random()), 1 / shape);
        pixels[i] = clamp(pixels[i] + noise);
        pixels[i + 1] = clamp(pixels[i + 1] + noise);
        pixels[i + 2] = clamp(pixels[i + 2] + noise);
    }
}

// Clamp function to keep pixel values in the range [0, 255]
function clamp(value) {
    return Math.max(0, Math.min(255, value));
}

// Export functions
export { addGaussianNoise, addUniformNoise, addExponentialNoise, addGammaNoise };
