

// 1. Import necessary modules
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');
const { performance } = require('perf_hooks');

// 2. Define constants for file paths
const KEYS_DIR = path.join(__dirname, 'keys');
const OUTPUT_DIR = path.join(__dirname, 'output');
const AES_128_KEY_PATH = path.join(KEYS_DIR, 'aes_128.key');
const AES_256_KEY_PATH = path.join(KEYS_DIR, 'aes_256.key');
const RSA_PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'rsa_public.pem');
const RSA_PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'rsa_private.pem');

// --- Helper Functions ---

/**
 * Ensures that all necessary directories and keys exist.
 * Generates keys if they are missing.
 */
async function setupEnvironment() {
    try {
        await fs.mkdir(KEYS_DIR, { recursive: true });
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        let keysGenerated = false;

        if (!(await fileExists(AES_128_KEY_PATH))) {
            const key = crypto.randomBytes(16); // 128 bits
            await fs.writeFile(AES_128_KEY_PATH, key);
            console.log('Generated AES-128 key.');
            keysGenerated = true;
        }

        if (!(await fileExists(AES_256_KEY_PATH))) {
            const key = crypto.randomBytes(32); // 256 bits
            await fs.writeFile(AES_256_KEY_PATH, key);
            console.log('Generated AES-256 key.');
            keysGenerated = true;
        }

        if (!(await fileExists(RSA_PRIVATE_KEY_PATH))) {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
            });
            await fs.writeFile(RSA_PUBLIC_KEY_PATH, publicKey);
            await fs.writeFile(RSA_PRIVATE_KEY_PATH, privateKey);
            console.log('Generated RSA 2048-bit key pair.');
            keysGenerated = true;
        }

        if (keysGenerated) {
            console.log(`Keys stored in: ${KEYS_DIR}`);
        }
    } catch (error) {
        console.error('Error during setup:', error.message);
        process.exit(1);
    }
}

/**
 * Checks if a file exists at the given path.
 */
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// --- Core Functionality Handlers ---

async function handleAES() {
    const { operation, keySize, mode } = await inquirer.prompt([
        { type: 'list', name: 'operation', message: 'Choose AES operation:', choices: ['Encrypt', 'Decrypt'] },
        { type: 'list', name: 'keySize', message: 'Choose key size:', choices: ['128-bit', '256-bit'] },
        { type: 'list', name: 'mode', message: 'Choose mode of operation:', choices: ['ECB', 'CFB'] },
    ]);

    const { inputFile } = await inquirer.prompt({
        name: 'inputFile',
        message: `Enter the path of the file to ${operation.toLowerCase()}:`,
        default: operation === 'Encrypt' ? 'my_message.txt' : 'output/aes_encrypted.dat',
    });

    const keyPath = keySize === '128-bit' ? AES_128_KEY_PATH : AES_256_KEY_PATH;
    const key = await fs.readFile(keyPath);
    const algorithm = `aes-${keySize.split('-')[0]}-${mode.toLowerCase()}`;

    const startTime = performance.now();
    try {
        if (operation === 'Encrypt') {
            let encryptedData;
            
            if (mode === 'ECB') {
                // ECB mode: No IV needed - use null
                const cipher = crypto.createCipheriv(algorithm, key, null);
                const input = await fs.readFile(inputFile);
                encryptedData = Buffer.concat([cipher.update(input), cipher.final()]);
            } else {
                // CFB mode: Generate and use IV
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv(algorithm, key, iv);
                const input = await fs.readFile(inputFile);
                encryptedData = Buffer.concat([iv, cipher.update(input), cipher.final()]);
            }

            const outputFile = path.join(OUTPUT_DIR, 'aes_encrypted.dat');
            await fs.writeFile(outputFile, encryptedData);
            
            const endTime = performance.now();
            console.log(`\n✅ File encrypted successfully!`);
            console.log(`   - Output saved to: ${outputFile}`);
            console.log(`   - Time taken: ${(endTime - startTime).toFixed(4)} ms`);
        } else { // Decrypt
            const encryptedData = await fs.readFile(inputFile);
            let decryptedText;

            if (mode === 'ECB') {
                // ECB mode: No IV to extract - use null
                const decipher = crypto.createDecipheriv(algorithm, key, null);
                decryptedText = Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();
            } else {
                // CFB mode: Extract IV from beginning of file
                const iv = encryptedData.slice(0, 16);
                const ciphertext = encryptedData.slice(16);
                const decipher = crypto.createDecipheriv(algorithm, key, iv);
                decryptedText = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString();
            }

            const endTime = performance.now();
            console.log('\n✅ Decryption successful! Content:');
            console.log('------------------------------------');
            console.log(decryptedText);
            console.log('------------------------------------');
            console.log(`   - Time taken: ${(endTime - startTime).toFixed(4)} ms`);
        }
    } catch (error) {
        console.error(`\n❌ Error during AES ${operation}:`, error.message);
    }
}

async function handleRSA() {
    const { operation } = await inquirer.prompt({
        type: 'list', name: 'operation', message: 'Choose RSA operation:', choices: ['Encrypt', 'Decrypt'],
    });

    const { inputFile } = await inquirer.prompt({
        name: 'inputFile',
        message: `Enter the path of the file to ${operation.toLowerCase()}:`,
        default: operation === 'Encrypt' ? 'my_message.txt' : 'output/rsa_encrypted.dat',
    });

    const startTime = performance.now();
    try {
        if (operation === 'Encrypt') {
            const publicKey = await fs.readFile(RSA_PUBLIC_KEY_PATH, 'utf-8');
            const dataToEncrypt = await fs.readFile(inputFile);
            
            if (dataToEncrypt.length > 214) { // 2048-bit key - 42 bytes OAEP padding
                 console.warn('\n⚠️ Warning: Input data may be too large for RSA encryption. RSA is for small data.');
            }

            const encryptedData = crypto.publicEncrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, dataToEncrypt);
            
            const outputFile = path.join(OUTPUT_DIR, 'rsa_encrypted.dat');
            await fs.writeFile(outputFile, encryptedData);
            
            const endTime = performance.now();
            console.log(`\n✅ File encrypted successfully!`);
            console.log(`   - Output saved to: ${outputFile}`);
            console.log(`   - Time taken: ${(endTime - startTime).toFixed(4)} ms`);
        } else { // Decrypt
            const privateKey = await fs.readFile(RSA_PRIVATE_KEY_PATH, 'utf-8');
            const encryptedData = await fs.readFile(inputFile);
            
            const decryptedData = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, encryptedData);
            
            const endTime = performance.now();
            console.log('\n✅ Decryption successful! Content:');
            console.log('------------------------------------');
            console.log(decryptedData.toString());
            console.log('------------------------------------');
            console.log(`   - Time taken: ${(endTime - startTime).toFixed(4)} ms`);
        }
    } catch (error) {
        console.error(`\n❌ Error during RSA ${operation}:`, error.message);
    }
}

async function handleRSASignature() {
    const { operation } = await inquirer.prompt({
        type: 'list', name: 'operation', message: 'Choose RSA Signature operation:', choices: ['Sign', 'Verify'],
    });

    const { dataFile } = await inquirer.prompt({
        name: 'dataFile', message: 'Enter the path of the data file:', default: 'my_message.txt',
    });
    
    const startTime = performance.now();
    try {
        if (operation === 'Sign') {
            const privateKey = await fs.readFile(RSA_PRIVATE_KEY_PATH, 'utf-8');
            const dataToSign = await fs.readFile(dataFile);
            
            const signer = crypto.createSign('sha256');
            signer.update(dataToSign);
            const signature = signer.sign(privateKey, 'hex');
            
            const signatureFile = path.join(OUTPUT_DIR, 'file.sig');
            await fs.writeFile(signatureFile, signature);

            const endTime = performance.now();
            console.log(`\n✅ Signature generated successfully!`);
            console.log(`   - Signature saved to: ${signatureFile}`);
            console.log(`   - Time taken: ${(endTime - startTime).toFixed(4)} ms`);
        } else { // Verify
            const { signatureFile } = await inquirer.prompt({
                name: 'signatureFile', message: 'Enter the path of the signature file:', default: 'output/file.sig',
            });
            
            const publicKey = await fs.readFile(RSA_PUBLIC_KEY_PATH, 'utf-8');
            const dataToVerify = await fs.readFile(dataFile);
            const signature = await fs.readFile(signatureFile, 'utf-8');
            
            const verifier = crypto.createVerify('sha256');
            verifier.update(dataToVerify);
            
            const isVerified = verifier.verify(publicKey, signature, 'hex');
            const endTime = performance.now();

            if (isVerified) {
                console.log('\n✅ Verification Successful: The signature is valid.');
            } else {
                console.log('\n❌ Verification Failed: The signature is NOT valid.');
            }
            console.log(`   - Time taken: ${(endTime - startTime).toFixed(4)} ms`);
        }
    } catch (error) {
        console.error(`\n❌ Error during RSA Signature ${operation}:`, error.message);
    }
}

async function handleSHA256() {
    const { inputFile } = await inquirer.prompt({
        name: 'inputFile', message: 'Enter the path of the file to hash:', default: 'my_message.txt',
    });

    try {
        const startTime = performance.now();
        const data = await fs.readFile(inputFile);
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        const endTime = performance.now();
        
        console.log(`\n✅ SHA-256 Hash for '${inputFile}':`);
        console.log(hash);
        console.log(`   - Time taken: ${(endTime - startTime).toFixed(4)} ms`);
    } catch (error) {
        console.error(`\n❌ Error during SHA-256 hashing:`, error.message);
    }
}

// --- Performance Measurement Function ---

async function measurePerformance() {
    const { operationType } = await inquirer.prompt({
        type: 'list',
        name: 'operationType',
        message: 'Choose operation to measure:',
        choices: [
            // AES Encryption
            'AES-128 ECB Encryption Time',
            'AES-128 CFB Encryption Time',
            'AES-256 ECB Encryption Time', 
            'AES-256 CFB Encryption Time',
            // AES Decryption
            'AES-128 ECB Decryption Time',
            'AES-128 CFB Decryption Time',
            'AES-256 ECB Decryption Time',
            'AES-256 CFB Decryption Time',
            // AES Comparisons
            'AES-128 ECB vs CFB Comparison',
            'AES-256 ECB vs CFB Comparison',
            'AES-128 vs AES-256 Comparison',
            'AES Encryption vs Decryption Comparison',
            // RSA
            'RSA Encryption Time vs Key Size',
            'RSA Decryption Time vs Key Size',
            'RSA Sign Time vs Key Size',
            'RSA Verify Time vs Key Size',
            // SHA-256
            'SHA-256 Time vs File Size'
        ]
    });

    console.log('\n🔬 Measuring performance... This may take a few seconds.\n');
    
    const results = [];
    const outputFile = path.join(OUTPUT_DIR, 'performance_results.json');

    try {
        if (operationType.includes('AES')) {
            // Test different file sizes for AES
            const fileSizes = [16, 64, 256, 1024, 4096, 16384, 65536]; // 16 bytes to 64KB
            
            // Determine which configurations to test
            let configurations = [];
            const isEncryption = operationType.includes('Encryption') || (!operationType.includes('Decryption') && !operationType.includes('vs Decryption'));
            const isDecryption = operationType.includes('Decryption') || operationType.includes('vs Decryption');
            
            if (operationType.includes('ECB') && operationType.includes('CFB')) {
                // Compare ECB vs CFB for specific key size
                const keySize = operationType.includes('128') ? 128 : 256;
                configurations = [
                    { keySize: keySize, mode: 'ecb', label: `AES-${keySize} ECB` },
                    { keySize: keySize, mode: 'cfb', label: `AES-${keySize} CFB` }
                ];
            } else if (operationType.includes('128') && operationType.includes('256')) {
                // Compare 128 vs 256 for specific mode
                const mode = operationType.includes('ECB') ? 'ecb' : 'cfb';
                configurations = [
                    { keySize: 128, mode: mode, label: 'AES-128 ' + mode.toUpperCase() },
                    { keySize: 256, mode: mode, label: 'AES-256 ' + mode.toUpperCase() }
                ];
            } else if (operationType.includes('Encryption') && operationType.includes('Decryption')) {
                // Compare encryption vs decryption
                const keySize = operationType.includes('128') ? 128 : 256;
                const mode = operationType.includes('ECB') ? 'ecb' : 'cfb';
                configurations = [
                    { keySize: keySize, mode: mode, label: `AES-${keySize} ${mode.toUpperCase()} Encryption`, operation: 'encrypt' },
                    { keySize: keySize, mode: mode, label: `AES-${keySize} ${mode.toUpperCase()} Decryption`, operation: 'decrypt' }
                ];
            } else {
                // Single configuration
                const keySize = operationType.includes('128') ? 128 : 256;
                const mode = operationType.includes('ECB') ? 'ecb' : 'cfb';
                const operation = isEncryption ? 'encrypt' : 'decrypt';
                configurations = [
                    { keySize: keySize, mode: mode, label: `AES-${keySize} ${mode.toUpperCase()} ${isEncryption ? 'Encryption' : 'Decryption'}`, operation: operation }
                ];
            }

            for (const config of configurations) {
                for (const size of fileSizes) {
                    // Create test file with random data
                    const testData = crypto.randomBytes(size);
                    const testFile = path.join(OUTPUT_DIR, `test_${size}.bin`);
                    await fs.writeFile(testFile, testData);

                    const key = crypto.randomBytes(config.keySize / 8);
                    const algorithm = `aes-${config.keySize}-${config.mode}`;
                    
                    let iv, encryptedData;
                    if (config.mode === 'ecb') {
                        // ECB mode: No IV
                        iv = null;
                    } else {
                        // CFB mode: Generate IV
                        iv = crypto.randomBytes(16);
                    }

                    const startTime = performance.now();
                    
                    if (config.operation === 'encrypt' || isEncryption) {
                        // Perform encryption
                        if (config.mode === 'ecb') {
                            const cipher = crypto.createCipheriv(algorithm, key, iv);
                            encryptedData = Buffer.concat([cipher.update(testData), cipher.final()]);
                        } else {
                            const cipher = crypto.createCipheriv(algorithm, key, iv);
                            encryptedData = Buffer.concat([cipher.update(testData), cipher.final()]);
                        }
                    } else {
                        // Perform decryption - first encrypt to get data to decrypt
                        if (config.mode === 'ecb') {
                            const cipher = crypto.createCipheriv(algorithm, key, iv);
                            encryptedData = Buffer.concat([cipher.update(testData), cipher.final()]);
                            const decipher = crypto.createDecipheriv(algorithm, key, iv);
                            const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
                        } else {
                            const cipher = crypto.createCipheriv(algorithm, key, iv);
                            const cipherData = Buffer.concat([cipher.update(testData), cipher.final()]);
                            const encryptedDataWithIV = Buffer.concat([iv, cipherData]);
                            const decipherIV = encryptedDataWithIV.slice(0, 16);
                            const ciphertext = encryptedDataWithIV.slice(16);
                            const decipher = crypto.createDecipheriv(algorithm, key, decipherIV);
                            const decryptedData = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
                        }
                    }
                    
                    const endTime = performance.now();
                    const timeTaken = endTime - startTime;

                    results.push({
                        size: size,
                        time: timeTaken,
                        keySize: config.keySize,
                        mode: config.mode.toUpperCase(),
                        operation: config.operation === 'encrypt' || isEncryption ? 'Encryption' : 'Decryption',
                        label: config.label
                    });

                    console.log(`File: ${size} bytes | ${config.label} | Time: ${timeTaken.toFixed(4)} ms`);
                    
                    // Clean up
                    await fs.unlink(testFile).catch(() => {});
                }
            }

        } else if (operationType.includes('RSA')) {
            // Test RSA with different key sizes
            const keySizes = [512, 1024, 2048, 3072, 4096];
            const testData = crypto.randomBytes(32); // 32 bytes test data

            for (const keySize of keySizes) {
                try {
                    const startTime = performance.now();
                    
                    // Generate key pair
                    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                        modulusLength: keySize,
                        publicKeyEncoding: { type: 'spki', format: 'pem' },
                        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
                    });

                    if (operationType.includes('Encryption')) {
                        // Perform RSA encryption
                        const encrypted = crypto.publicEncrypt(
                            { 
                                key: publicKey, 
                                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                                oaepHash: 'sha256'
                            }, 
                            testData
                        );
                    } else if (operationType.includes('Decryption')) {
                        // Perform RSA decryption
                        const encrypted = crypto.publicEncrypt(
                            { 
                                key: publicKey, 
                                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                                oaepHash: 'sha256'
                            }, 
                            testData
                        );
                        const decrypted = crypto.privateDecrypt(
                            { 
                                key: privateKey, 
                                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                                oaepHash: 'sha256'
                            }, 
                            encrypted
                        );
                    } else if (operationType.includes('Sign')) {
                        // Perform RSA signing
                        const signer = crypto.createSign('sha256');
                        signer.update(testData);
                        const signature = signer.sign(privateKey, 'hex');
                    } else if (operationType.includes('Verify')) {
                        // Perform RSA verification
                        const signer = crypto.createSign('sha256');
                        signer.update(testData);
                        const signature = signer.sign(privateKey, 'hex');
                        const verifier = crypto.createVerify('sha256');
                        verifier.update(testData);
                        verifier.verify(publicKey, signature, 'hex');
                    }

                    const endTime = performance.now();
                    const timeTaken = endTime - startTime;

                    let operationName = 'RSA Encryption';
                    if (operationType.includes('Decryption')) operationName = 'RSA Decryption';
                    if (operationType.includes('Sign')) operationName = 'RSA Sign';
                    if (operationType.includes('Verify')) operationName = 'RSA Verify';

                    results.push({
                        keySize: keySize,
                        time: timeTaken,
                        operation: operationName
                    });

                    console.log(`Key Size: ${keySize} bits | ${operationName} | Time: ${timeTaken.toFixed(4)} ms`);
                    
                } catch (error) {
                    console.log(`Key Size: ${keySize} bits | Failed: ${error.message}`);
                }
            }

        } else if (operationType.includes('SHA-256')) {
            // Test SHA-256 with different file sizes
            const fileSizes = [16, 64, 256, 1024, 4096, 16384, 65536];

            for (const size of fileSizes) {
                const testData = crypto.randomBytes(size);
                const testFile = path.join(OUTPUT_DIR, `hash_test_${size}.bin`);
                await fs.writeFile(testFile, testData);

                const startTime = performance.now();
                
                // Perform hashing
                const hash = crypto.createHash('sha256').update(testData).digest('hex');
                
                const endTime = performance.now();
                const timeTaken = endTime - startTime;

                results.push({
                    size: size,
                    time: timeTaken,
                    operation: 'SHA-256'
                });

                console.log(`File: ${size} bytes | Time: ${timeTaken.toFixed(4)} ms`);
                
                // Clean up
                await fs.unlink(testFile).catch(() => {});
            }
        }

        // Save results to JSON file
        await fs.writeFile(outputFile, JSON.stringify(results, null, 2));
        
        console.log('\n📊 Performance measurement completed!');
        console.log(`📁 Results saved to: ${outputFile}`);
        
        // Display results in table format
        console.log('\n📈 Results Summary:');
        console.log('='.repeat(70));
        
        if (operationType.includes('AES')) {
            console.log('File Size (bytes)\tConfiguration\t\t\tTime (ms)');
            console.log('-'.repeat(70));
            results.forEach(result => {
                console.log(`${result.size}\t\t\t${result.label}\t${result.time.toFixed(4)}`);
            });
        } else if (operationType.includes('RSA')) {
            console.log('Key Size (bits)\t\tOperation\t\tTime (ms)');
            console.log('-'.repeat(60));
            results.forEach(result => {
                console.log(`${result.keySize}\t\t\t${result.operation}\t${result.time.toFixed(4)}`);
            });
        } else if (operationType.includes('SHA-256')) {
            console.log('File Size (bytes)\tTime (ms)');
            console.log('-'.repeat(40));
            results.forEach(result => {
                console.log(`${result.size}\t\t\t${result.time.toFixed(4)}`);
            });
        }

        console.log('\n💡 Graph Creation Tips:');
        console.log('1. Use Excel/Google Sheets: Copy the data above');
        console.log('2. For AES: Plot File Size vs Time with different series for each configuration');
        console.log('3. For RSA: Plot Key Size vs Time for each operation');
        console.log('4. For SHA-256: Plot File Size vs Time');

    } catch (error) {
        console.error('\n❌ Error during performance measurement:', error.message);
    }
}

// --- Main Program Loop ---

async function main() {
    await setupEnvironment();
    console.log('\n--- Crypto Utility Tool ---');

    while (true) {
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'AES Encrypt/Decrypt',
                    'RSA Encrypt/Decrypt',
                    'RSA Sign/Verify File',
                    'SHA-256 Hash a File',
                    '📊 Measure Performance',
                    new inquirer.Separator(),
                    'Exit',
                ],
            },
        ]);

        console.log(''); // Newline for cleaner output

        switch (choice) {
            case 'AES Encrypt/Decrypt': await handleAES(); break;
            case 'RSA Encrypt/Decrypt': await handleRSA(); break;
            case 'RSA Sign/Verify File': await handleRSASignature(); break;
            case 'SHA-256 Hash a File': await handleSHA256(); break;
            case '📊 Measure Performance': await measurePerformance(); break;
            case 'Exit': console.log('Exiting program.'); return;
        }
        console.log('\n--------------------------\n');
    }
}

main().catch(err => {
    console.error('An unexpected error occurred:', err);
});