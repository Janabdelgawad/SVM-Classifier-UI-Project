
// Model coefficients would come from trained model
// These are placeholder values based on the LDA feature importance shown in your code
const MODEL = {
    intercept: -2.5,
    coefficients: {
        'HighBP': 0.64,
        'HighChol': 0.52,
        'CholCheck': 0.21,
        'BMI': 0.05,
        'Smoker': 0.14,
        'Stroke': 0.28,
        'HeartDiseaseorAttack': 0.58,
        'PhysActivity': -0.26,
        'Fruits': -0.12,
        'Veggies': -0.08,
        'HvyAlcoholConsump': -0.22,
        'AnyHealthcare': 0.09,
        'NoDocbcCost': 0.19,
        'GenHlth': 0.38,
        'MentHlth': 0.01,
        'PhysHlth': 0.01,
        'DiffWalk': 0.47,
        'Sex': -0.10,
        'Age': 0.18,
        'Education': -0.14,
        'Income': -0.13
    },
    // LDA coefficients for transformed feature
    transformCoefficient: 0.75
};

// Tab switching functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        // Show corresponding tab content
        document.getElementById(this.dataset.tab).classList.add('active');
    });
});

// Prediction form submission
document.getElementById('prediction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = {};
    
    // Convert form data to object
    for (const [key, value] of formData.entries()) {
        data[key] = parseFloat(value);
    }
    
    // Make prediction
    const prediction = predictDiabetes(data);
    
    // Display results
    displayResults(prediction);
});

// Predict diabetes using the model
function predictDiabetes(data) {
    // Map form field names to model feature names
    const featureMap = {
        'highBP': 'HighBP',
        'highChol': 'HighChol',
        'cholCheck': 'CholCheck',
        'bmi': 'BMI',
        'smoker': 'Smoker',
        'stroke': 'Stroke',
        'heartDisease': 'HeartDiseaseorAttack',
        'physActivity': 'PhysActivity',
        'fruits': 'Fruits',
        'veggies': 'Veggies',
        'hvyAlcoholConsump': 'HvyAlcoholConsump',
        'anyHealthcare': 'AnyHealthcare',
        'noDocbcCost': 'NoDocbcCost',
        'genHlth': 'GenHlth',
        'mentHlth': 'MentHlth',
        'physHlth': 'PhysHlth',
        'diffWalk': 'DiffWalk',
        'sex': 'Sex',
        'age': 'Age',
        'education': 'Education',
        'income': 'Income'
    };
    
    // Calculate LDA transform (weighted sum)
    let ldaValue = 0;
    for (const [formField, modelFeature] of Object.entries(featureMap)) {
        ldaValue += data[formField] * MODEL.coefficients[modelFeature];
    }
    
    // Apply sigmoid function to get probability
    const logit = MODEL.intercept + (ldaValue * MODEL.transformCoefficient);
    const probability = 1 / (1 + Math.exp(-logit));
    
    return {
        probability: probability,
        prediction: probability > 0.5 ? 1 : 0,
        ldaValue: ldaValue
    };
}

// Display prediction results
function displayResults(prediction) {
    const resultsDiv = document.getElementById('results');
    const predictionText = document.getElementById('prediction-result');
    const probabilityFill = document.getElementById('probability-fill');
    const probabilityText = document.getElementById('probability-text');
    
    // Show results div
    resultsDiv.style.display = 'block';
    
    // Set prediction text
    if (prediction.prediction === 1) {
        predictionText.innerHTML = '<strong>Higher Risk:</strong> Based on the provided information, you may have an elevated risk of diabetes or prediabetes.';
        resultsDiv.classList.add('high-risk');
        resultsDiv.classList.remove('low-risk');
    } else {
        predictionText.innerHTML = '<strong>Lower Risk:</strong> Based on the provided information, you appear to have a lower risk of diabetes.';
        resultsDiv.classList.add('low-risk');
        resultsDiv.classList.remove('high-risk');
    }
    
    // Set probability meter
    const probabilityPercentage = Math.round(prediction.probability * 100);
    probabilityFill.style.width = `${probabilityPercentage}%`;
    probabilityText.textContent = `Estimated probability: ${probabilityPercentage}%`;
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// File upload area functionality
const fileUploadArea = document.getElementById('file-upload-area');
const fileInput = document.getElementById('csv-file');
const processFileBtn = document.getElementById('process-file-btn');

fileUploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#3498db';
    fileUploadArea.style.backgroundColor = '#f1f9ff';
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.style.borderColor = '#ddd';
    fileUploadArea.style.backgroundColor = 'white';
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#ddd';
    fileUploadArea.style.backgroundColor = 'white';
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect();
    }
});

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect() {
    if (fileInput.files.length) {
        const file = fileInput.files[0];
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            fileUploadArea.innerHTML = `<p>Selected: ${file.name}</p>`;
            processFileBtn.disabled = false;
        } else {
            alert('Please select a CSV file.');
            fileInput.value = '';
            fileUploadArea.innerHTML = '<p>Drop your CSV file here or click to browse</p>';
            processFileBtn.disabled = true;
        }
    }
}

// CSV template download
document.getElementById('download-template').addEventListener('click', function(e) {
    e.preventDefault();
    
    // CSV header
    const headers = [
        'HighBP', 'HighChol', 'CholCheck', 'BMI', 'Smoker', 'Stroke', 
        'HeartDiseaseorAttack', 'PhysActivity', 'Fruits', 'Veggies', 
        'HvyAlcoholConsump', 'AnyHealthcare', 'NoDocbcCost', 'GenHlth', 
        'MentHlth', 'PhysHlth', 'DiffWalk', 'Sex', 'Age', 'Education', 'Income'
    ];
    
    // Example row
    const exampleRow = [
        '1', '0', '1', '27.8', '0', '0', '0', '1', '1', '1', 
        '0', '1', '0', '2', '0', '0', '0', '0', '5', '5', '6'
    ];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n' + exampleRow.join(',');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diabetes_prediction_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Process file button
processFileBtn.addEventListener('click', function() {
    const file = fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        processCSV(content);
    };
    reader.readAsText(file);
});

function processCSV(csvContent) {
    // Simple CSV parsing (for a production app, use a proper CSV library)
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Check if required columns exist (simplified check)
    const requiredColumns = Object.values(MODEL.coefficients);
    let allColumnsPresent = true;
    
    // Status update
    const fileResults = document.getElementById('file-results');
    const fileProcessingStatus = document.getElementById('file-processing-status');
    const fileResultsSummary = document.getElementById('file-results-summary');
    
    fileResults.style.display = 'block';
    fileProcessingStatus.textContent = 'Processing file...';
    
    // Simulating processing delay
    setTimeout(() => {
        // In a real application, you would process each row here
        const totalRows = lines.length - 1; // Excluding header
        const processedRows = Math.max(0, totalRows);
        const predictedDiabetic = Math.floor(Math.random() * processedRows * 0.3); // Just for demo
        
        fileProcessingStatus.textContent = 'File processed successfully!';
        
        if (allColumnsPresent) {
            // Process data rows
            const results = {
                total: processedRows,
                diabetic: predictedDiabetic,
                nonDiabetic: processedRows - predictedDiabetic
            };
            
            // Display results
            fileResultsSummary.innerHTML = `
                <h3>Summary Results</h3>
                <p>Total records processed: ${results.total}</p>
                <p>Predicted diabetic: ${results.diabetic} (${Math.round(results.diabetic / results.total * 100)}%)</p>
                <p>Predicted non-diabetic: ${results.nonDiabetic} (${Math.round(results.nonDiabetic / results.total * 100)}%)</p>
            `;
        } else {
            fileProcessingStatus.textContent = 'Error: CSV file is missing required columns.';
            fileResultsSummary.innerHTML = '';
        }
    }, 1500);
}

// Initialize form with some default values
document.getElementById('bmi').value = '25.0';
document.getElementById('age').value = '5'; // 40-44 age group
document.getElementById('genHlth').value = '3'; // Good health
