

function countSameBits(hex1, hex2) {
    // Convert hex strings to binary strings
    let binary1 = hexToBinary(hex1);
    let binary2 = hexToBinary(hex2);
    
    let sameBits = 0;
    let totalBits = binary1.length;
    
    // Count how many bits are the same
    for (let i = 0; i < totalBits; i++) {
        if (binary1[i] === binary2[i]) {
            sameBits++;
        }
    }
    
    return {
        sameBits: sameBits,
        totalBits: totalBits,
        percentage: ((sameBits / totalBits) * 100).toFixed(2)
    };
}

function hexToBinary(hexString) {
    let binary = '';
    for (let i = 0; i < hexString.length; i++) {
        // Convert each hex character to 4-bit binary
        let bits = parseInt(hexString[i], 16).toString(2).padStart(4, '0');
        binary += bits;
    }
    return binary;
}

// Example usage with sample MD5 hashes
let H1 = "611cc4949d61b86a9364d9139c499f31"; // Original hash
let H2 = "9c4c2b135506e94ff91ba2b37ecb3723"; // Hash after 1-bit change

let result = countSameBits(H1, H2);

console.log("Hash 1 (H1):", H1);
console.log("Hash 2 (H2):", H2);
console.log("\nComparison Results:");
console.log("Same bits:", result.sameBits + "/" + result.totalBits);
console.log("Percentage:", result.percentage + "%");
console.log("Different bits:", result.totalBits - result.sameBits);

// Additional analysis
console.log("\nExpected Result: ~50% bit similarity (avalanche effect)");