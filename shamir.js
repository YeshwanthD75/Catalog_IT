const fs = require('fs');

// Function to decode the value from different bases
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Function for Lagrange interpolation
function lagrangeInterpolation(points, x) {
    let result = 0;

    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                term *= (x - points[j].x) / (points[i].x - points[j].x);
            }
        }
        result += term;
    }

    return result;
}

// Main function to read JSON, decode values, and calculate constant term
function findConstantTerm(filePath) {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const n = data.keys.n;
    const k = data.keys.k;

    // Decode the values from different bases
    const points = [];
    for (const key in data) {
        if (key !== 'keys') {
            const x = parseInt(key); // x is the key of the object
            const base = parseInt(data[key].base); // Base of the value
            const y = decodeValue(data[key].value, base); // Decode y value
            points.push({ x, y });
        }
    }

    // Ensure we only use the first k points for interpolation
    const selectedPoints = points.slice(0, k);

    // Perform Lagrange interpolation to find the constant term c
    const constantTerm = lagrangeInterpolation(selectedPoints, 0);

    // Round off the constant term and print it
    const roundedConstantTerm = Math.round(constantTerm);

    console.log('Constant term (c) rounded:', roundedConstantTerm);
}

// Test the function with the provided JSON file
findConstantTerm('testcase.json');
findConstantTerm('testcase2.json');

