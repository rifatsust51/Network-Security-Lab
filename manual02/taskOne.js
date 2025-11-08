
function bruteForceCaesar(ciphertext) {
    console.log(`\n--- Starting Caesar Cipher Brute-Force Attack ---`);
    console.log(`Ciphertext: ${ciphertext}`);
    console.log(`-------------------------------------------------`);
    
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let potentialPlaintext = '';

    // Iterate through all 25 possible keys (shifts 1 through 25)
    for (let shift = 1; shift <= 25; shift++) {
        let plaintext = '';
        
        // Decrypt each character in the ciphertext
        for (const char of ciphertext.toLowerCase()) {
            const charIndex = alphabet.indexOf(char);

            if (charIndex === -1) {
                // If the character is not a letter, keep it as is (e.g., space, punctuation)
                plaintext += char;
            } else {
                // Calculate the new index by 'shifting back'.
                // The '+ 26' handles negative results from subtraction (e.g., 'a' (0) - 1 = -1).
                const newIndex = (charIndex - shift + 26) % 26;
                plaintext += alphabet[newIndex];
            }
        }
        
        
        console.log(`Shift ${String(shift).padStart(2, '0')}: ${plaintext}`);


        if (plaintext.includes('the') || plaintext.includes('and') || plaintext.includes('are')) {
             potentialPlaintext = `\n[SUCCESS] Potential plaintext found at Shift ${shift}: ${plaintext}\n`;
        }
    }
    
    if (potentialPlaintext) {
        console.log(potentialPlaintext);
    } else {
        console.log(`\n--- Attack Complete: No obvious English plaintext was automatically found. ---`);
    }
}


const labCipher = 'odroboewscdrolocdcwkbdmyxdbkmdzvkdpybwyeddrobo';

console.log("Analyzing the ciphertext provided in the lab handout...");
bruteForceCaesar(labCipher);


