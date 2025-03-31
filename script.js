const imageInput = document.getElementById('imageInput');
const pixelationInput = document.getElementById('pixelationInput');
const canvas = document.getElementById('canvas');
const downloadButton = document.getElementById('downloadButton');
const ctx = canvas.getContext('2d');

let originalImage = new Image();
let originalFileName = 'pixelated-image.png';

const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/bmp'];

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        if (!supportedFormats.includes(file.type)) {
            alert(`Unsupported file format. Please upload one of the following formats: ${supportedFormats.join(', ')}`);
            imageInput.value = ''; // Clear the input
            return;
        }
        originalFileName = file.name.replace(/\.[^/.]+$/, '-pixelated.png'); // Replace extension
        const url = URL.createObjectURL(file); // Use Object URL for faster loading
        originalImage.src = url;
    }
});

originalImage.onload = () => {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0);
    applyPixelation();
};

pixelationInput.addEventListener('input', applyPixelation);

function applyPixelation() {
    const pixelSize = Math.max(1, Math.min(50, parseInt(pixelationInput.value, 10) || 10));
    pixelationInput.value = pixelSize; // Ensure the value stays within bounds
    const width = canvas.width;
    const height = canvas.height;

    // Draw the original image at a reduced size
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = Math.ceil(width / pixelSize);
    tempCanvas.height = Math.ceil(height / pixelSize);
    tempCtx.drawImage(originalImage, 0, 0, tempCanvas.width, tempCanvas.height);

    // Scale the reduced image back up to the original size
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, width, height);
}

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = originalFileName;
    link.href = canvas.toDataURL();
    link.click();
});
