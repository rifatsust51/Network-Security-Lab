// // Substitution Cipher Decoder using Frequency Analysis

// // English letter frequencies (from the document)
// const englishFreq = {
//   'e': 12.22, 't': 9.67, 'o': 7.63, 'a': 8.05, 'i': 6.28,
//   'n': 6.95, 's': 6.02, 'h': 6.62, 'r': 5.29, 'd': 5.10,
//   'l': 4.08, 'c': 2.23, 'u': 2.92, 'm': 2.33, 'w': 2.60,
//   'f': 2.14, 'g': 2.30, 'y': 2.04, 'p': 1.66, 'b': 1.67,
//   'v': 0.82, 'k': 0.95, 'j': 0.19, 'x': 0.11, 'q': 0.06, 'z': 0.06
// };

// // Cipher texts
// const cipher1 = `af p xpkcaqvnpk pfg, af ipqe qpri, gauuikifc tpw, ceiri udvk tiki afgarxifrphni cd eao- -wvmd popkwn, hiqpvri du ear jvaql vfgikrcpfgafm du cei xkafqaxnir du xrwqedearcdkw pfg du ear aopmafpcasi xkdhafmr afcd fit pkipr. ac tpr qdoudkcafm cd lfdt cepc au pfwceafm epxxifig cd ringdf eaorinu hiudki cei opceiopcaqr du cei uaing qdvng hi qdoxnicinw tdklig dvc- -pfg edt rndtnw ac xkdqiigig, pfg edt odvfcpafdvr cei dhrcpqnir--ceiki tdvng pc niprc kiopaf dfi mddg oafg cepc tdvng qdfcafvi cei kiripkqe`;

// const cipher2 = `aceah toz puvg vcdl omj puvg yudqecov, omj loj auum klu thmjuv hs klu zlcvu shv zcbkg guovz, upuv zcmdu lcz vuwovroaeu jczoyyuovomdu omj qmubyudkuj vukqvm. klu vcdluz lu loj avhqnlk aodr svhw lcz kvopuez loj mht audhwu o ehdoe eunumj, omj ck toz yhyqeoveg auecupuj, tlokupuv klu hej sher wcnlk zog, klok klu lcee ok aon umj toz sqee hs kqmmuez zkqssuj tckl kvuozqvu. omj cs klok toz mhk umhqnl shv sowu, kluvu toz oezh lcz yvhehmnuj pcnhqv kh wovpue ok. kcwu thvu hm, aqk ck zuuwuj kh lopu eckkeu ussudk hm wv. aonncmz. ok mcmukg lu toz wqdl klu zowu oz ok scskg. ok mcmukg-mcmu klug aunom kh doee lcw tuee-yvuzuvpuj; aqk qmdlomnuj thqej lopu auum muovuv klu wovr. kluvu tuvu zhwu klok zlhhr klucv luojz omj klhqnlk klcz toz khh wqdl hs o nhhj klcmn; ck zuuwuj qmsocv klok omghmu zlhqej yhzzuzz (oyyovumkeg) yuvyukqoe ghqkl oz tuee oz (vuyqkujeg) cmubloqzkcaeu tuoekl. ck tcee lopu kh au yocj shv, klug zocj. ck czm'k mokqvoe, omj kvhqaeu tcee dhwu hs ck! aqk zh sov kvhqaeu loj mhk dhwu; omj oz wv. aonncmz toz numuvhqz tckl lcz whmug, whzk yuhyeu tuvu tceecmn kh shvncpu lcw lcz hjjckcuz omj lcz nhhj shvkqmu. lu vuwocmuj hm pczckcmn kuvwz tckl lcz vueokcpuz (ubduyk, hs dhqvzu, klu zodrpceeu aonncmzuz), omj lu loj womg juphkuj ojwcvuvz owhmn klu lhaackz hs yhhv omj qmcwyhvkomk sowcecuz. aqk lu loj mh dehzu svcumjz, qmkce zhwu hs lcz ghqmnuv dhqzcmz aunom kh nvht qy. klu uejuzk hs kluzu, omj aceah'z sophqvcku, toz ghqmn svhjh aonncmz. tlum aceah toz mcmukg-mcmu lu ojhykuj svhjh oz lcz lucv, omj avhqnlk lcw kh ecpu ok aon umj; omj klu lhyuz hs klu zodrpceeu- aonncmzuz tuvu scmoeeg jozluj. aceah omj svhjh loyyumuj kh lopu klu zowu acvkljog, zuykuwauv 22mj. ghq loj aukkuv dhwu omj ecpu luvu, svhjh wg eoj, zocj aceah hmu jog; omj klum tu dom dueuavoku hqv acvkljog-yovkcuz dhwshvkoaeg khnukluv. ok klok kcwu svhjh toz zkcee cm lcz ktuumz, oz klu lhaackz doeeuj klu cvvuzyhmzcaeu ktumkcuz auktuum dlcejlhhj omj dhwcmn hs onu ok klcvkg-klvuu`;

// // STEP 1: Calculate frequency of each letter in ciphertext
// function calculateFrequency(text) {
//   const freq = {};
//   let totalLetters = 0;

//   for (let char of text.toLowerCase()) {
//     if (char >= 'a' && char <= 'z') {
//       freq[char] = (freq[char] || 0) + 1;
//       totalLetters++;
//     }
//   }

//   // Convert to percentages
//   const freqPercent = {};
//   for (let char in freq) {
//     freqPercent[char] = (freq[char] / totalLetters) * 100;
//   }

//   return freqPercent;
// }

// // STEP 2: Sort letters by frequency
// function sortByFrequency(freqObj) {
//   return Object.entries(freqObj)
//     .sort((a, b) => b[1] - a[1])
//     .map(entry => entry[0]);
// }

// // STEP 3: Create substitution mapping
// function createMapping(cipherFreq) {
//   const cipherSorted = sortByFrequency(cipherFreq);
//   const englishSorted = sortByFrequency(englishFreq);
  
//   const mapping = {};
//   for (let i = 0; i < cipherSorted.length && i < englishSorted.length; i++) {
//     mapping[cipherSorted[i]] = englishSorted[i];
//   }
  
//   return mapping;
// }

// // STEP 4: Apply substitution
// function applySubstitution(text, mapping) {
//   let result = '';
//   for (let char of text) {
//     const lower = char.toLowerCase();
//     if (mapping[lower]) {
//       result += char === char.toUpperCase() && char !== char.toLowerCase()
//         ? mapping[lower].toUpperCase()
//         : mapping[lower];
//     } else {
//       result += char;
//     }
//   }
//   return result;
// }

// // STEP 5: Main decoding function
// function decodeCipher(cipherText, cipherName) {
//   console.log(`\n${'='.repeat(60)}`);
//   console.log(`DECODING ${cipherName}`);
//   console.log('='.repeat(60));
  
//   // Calculate frequency
//   const freq = calculateFrequency(cipherText);
  
//   // Show frequency analysis
//   const sortedCipher = sortByFrequency(freq);
//   console.log('\nFrequency Analysis (Top 10):');
//   for (let i = 0; i < 10 && i < sortedCipher.length; i++) {
//     const char = sortedCipher[i];
//     console.log(`  ${i + 1}. '${char}' - ${freq[char].toFixed(2)}%`);
//   }
  
//   // Create mapping
//   const mapping = createMapping(freq);
  
//   console.log('\nSubstitution Mapping:');
//   console.log('  Cipher -> English');
//   for (let cipher in mapping) {
//     console.log(`  '${cipher}' -> '${mapping[cipher]}'`);
//   }
  
//   // Decode
//   const decoded = applySubstitution(cipherText, mapping);
  
//   console.log('\nDecoded Text:');
//   console.log('-'.repeat(60));
//   console.log(decoded);
//   console.log('-'.repeat(60));
  
//   return { decoded, freq, mapping };
// }

// // Main execution
// console.log('SUBSTITUTION CIPHER DECODER');
// console.log('Using Frequency Analysis\n');

// // Decode both ciphers
// const result1 = decodeCipher(cipher1, 'CIPHER-1');
// const result2 = decodeCipher(cipher2, 'CIPHER-2');

// // Comparative Analysis
// console.log('\n' + '='.repeat(60));
// console.log('COMPARATIVE ANALYSIS');
// console.log('='.repeat(60));

// console.log('\nExpected English Frequencies (Top 5):');
// const englishSorted = sortByFrequency(englishFreq);
// for (let i = 0; i < 5; i++) {
//   console.log(`  ${i + 1}. '${englishSorted[i]}' - ${englishFreq[englishSorted[i]]}%`);
// }

// console.log('\n' + '-'.repeat(60));
// console.log('WHICH CIPHER WAS EASIER TO BREAK?');
// console.log('-'.repeat(60));

// console.log('\nAnswer: CIPHER-2 was easier to break\n');

// console.log('Reasons:');
// console.log('1. LENGTH: Cipher-2 is much longer (~900 characters vs ~400)');
// console.log('   - More data = more accurate frequency distribution');
// console.log('   - Statistical patterns converge to expected values');

// console.log('\n2. FREQUENCY MATCHING: Cipher-2 frequencies match English better');
// console.log('   - Longer text reduces random statistical variations');
// console.log('   - Common letters appear at expected rates');

// console.log('\n3. CONTEXT: More text provides more context');
// console.log('   - Easier to identify common words and patterns');
// console.log('   - Can verify correctness through readability');

// console.log('\n4. SAMPLE SIZE: Law of large numbers applies');
// console.log('   - Short texts have high variance from expected frequencies');
// console.log('   - Long texts are more predictable and stable');

// console.log('\n' + '='.repeat(60));








// Substitution Cipher Decoder using Frequency Analysis and Pattern Matching

// English letter frequencies
const englishFreq = {
  'e': 12.22, 't': 9.67, 'o': 7.63, 'a': 8.05, 'i': 6.28,
  'n': 6.95, 's': 6.02, 'h': 6.62, 'r': 5.29, 'd': 5.10,
  'l': 4.08, 'c': 2.23, 'u': 2.92, 'm': 2.33, 'w': 2.60,
  'f': 2.14, 'g': 2.30, 'y': 2.04, 'p': 1.66, 'b': 1.67,
  'v': 0.82, 'k': 0.95, 'j': 0.19, 'x': 0.11, 'q': 0.06, 'z': 0.06
};

// Common English words for pattern matching
const commonWords = new Set([
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
  'his', 'from', 'they', 'was', 'been', 'have', 'were', 'said', 'each', 'which',
  'their', 'time', 'will', 'way', 'about', 'many', 'then', 'them', 'would',
  'like', 'into', 'than', 'more', 'these', 'some', 'could', 'other', 'only'
]);

// Cipher texts
const cipher1 = `af p xpkcaqvnpk pfg, af ipqe qpri, gauuikifc tpw, ceiri udvk tiki afgarxifrphni cd eao- -wvmd popkwn, hiqpvri du ear jvaql vfgikrcpfgafm du cei xkafqaxnir du xrwqedearcdkw pfg du ear aopmafpcasi xkdhafmr afcd fit pkipr. ac tpr qdoudkcafm cd lfdt cepc au pfwceafm epxxifig cd ringdf eaorinu hiudki cei opceiopcaqr du cei uaing qdvng hi qdoxnicinw tdklig dvc- -pfg edt rndtnw ac xkdqiigig, pfg edt odvfcpafdvr cei dhrcpqnir--ceiki tdvng pc niprc kiopaf dfi mddg oafg cepc tdvng qdfcafvi cei kiripkqe`;

const cipher2 = `aceah toz puvg vcdl omj puvg yudqecov, omj loj auum klu thmjuv hs klu zlcvu shv zcbkg guovz, upuv zcmdu lcz vuwovroaeu jczoyyuovomdu omj qmubyudkuj vukqvm. klu vcdluz lu loj avhqnlk aodr svhw lcz kvopuez loj mht audhwu o ehdoe eunumj, omj ck toz yhyqeoveg auecupuj, tlokupuv klu hej sher wcnlk zog, klok klu lcee ok aon umj toz sqee hs kqmmuez zkqssuj tckl kvuozqvu. omj cs klok toz mhk umhqnl shv sowu, kluvu toz oezh lcz yvhehmnuj pcnhqv kh wovpue ok. kcwu thvu hm, aqk ck zuuwuj kh lopu eckkeu ussudk hm wv. aonncmz. ok mcmukg lu toz wqdl klu zowu oz ok scskg. ok mcmukg-mcmu klug aunom kh doee lcw tuee-yvuzuvpuj; aqk qmdlomnuj thqej lopu auum muovuv klu wovr. kluvu tuvu zhwu klok zlhhr klucv luojz omj klhqnlk klcz toz khh wqdl hs o nhhj klcmn; ck zuuwuj qmsocv klok omghmu zlhqej yhzzuzz (oyyovumkeg) yuvyukqoe ghqkl oz tuee oz (vuyqkujeg) cmubloqzkcaeu tuoekl. ck tcee lopu kh au yocj shv, klug zocj. ck czm'k mokqvoe, omj kvhqaeu tcee dhwu hs ck! aqk zh sov kvhqaeu loj mhk dhwu; omj oz wv. aonncmz toz numuvhqz tckl lcz whmug, whzk yuhyeu tuvu tceecmn kh shvncpu lcw lcz hjjckcuz omj lcz nhhj shvkqmu. lu vuwocmuj hm pczckcmn kuvwz tckl lcz vueokcpuz (ubduyk, hs dhqvzu, klu zodrpceeu aonncmzuz), omj lu loj womg juphkuj ojwcvuvz owhmn klu lhaackz hs yhhv omj qmcwyhvkomk sowcecuz. aqk lu loj mh dehzu svcumjz, qmkce zhwu hs lcz ghqmnuv dhqzcmz aunom kh nvht qy. klu uejuzk hs kluzu, omj aceah'z sophqvcku, toz ghqmn svhjh aonncmz. tlum aceah toz mcmukg-mcmu lu ojhykuj svhjh oz lcz lucv, omj avhqnlk lcw kh ecpu ok aon umj; omj klu lhyuz hs klu zodrpceeu- aonncmzuz tuvu scmoeeg jozluj. aceah omj svhjh loyyumuj kh lopu klu zowu acvkljog, zuykuwauv 22mj. ghq loj aukkuv dhwu omj ecpu luvu, svhjh wg eoj, zocj aceah hmu jog; omj klum tu dom dueuavoku hqv acvkljog-yovkcuz dhwshvkoaeg khnukluv. ok klok kcwu svhjh toz zkcee cm lcz ktuumz, oz klu lhaackz doeeuj klu cvvuzyhmzcaeu ktumkcuz auktuum dlcejlhhj omj dhwcmn hs onu ok klcvkg-klvuu`;

// Calculate frequency of each letter in ciphertext
function calculateFrequency(text) {
  const freq = {};
  let totalLetters = 0;

  for (let char of text.toLowerCase()) {
    if (char >= 'a' && char <= 'z') {
      freq[char] = (freq[char] || 0) + 1;
      totalLetters++;
    }
  }

  const freqPercent = {};
  for (let char in freq) {
    freqPercent[char] = (freq[char] / totalLetters) * 100;
  }

  return freqPercent;
}

// Sort letters by frequency
function sortByFrequency(freqObj) {
  return Object.entries(freqObj)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
}

// Create substitution mapping based on frequency
function createFrequencyMapping(cipherFreq) {
  const cipherSorted = sortByFrequency(cipherFreq);
  const englishSorted = sortByFrequency(englishFreq);
  
  const mapping = {};
  for (let i = 0; i < cipherSorted.length && i < englishSorted.length; i++) {
    mapping[cipherSorted[i]] = englishSorted[i];
  }
  
  return mapping;
}

// Apply substitution using a given mapping
function applySubstitution(text, mapping) {
  let result = '';
  for (let char of text) {
    const lower = char.toLowerCase();
    if (mapping[lower]) {
      result += (char === lower) ? mapping[lower] : mapping[lower].toUpperCase();
    } else {
      result += char;
    }
  }
  return result;
}

// Get words from text
function getWords(text) {
  return text.toLowerCase().match(/[a-z]+/g) || [];
}

// Score a decryption based on common English words
function scoreDecryption(text) {
  const words = getWords(text);
  let score = 0;
  
  for (const word of words) {
    if (commonWords.has(word)) {
      score += word.length;
    }
    // Bonus for "the"
    if (word === 'the') score += 5;
    if (word === 'and') score += 3;
  }
  
  return score;
}

// Advanced pattern-based refinement using hill climbing
function refineWithPatternMatching(initialMapping, cipherText, maxIterations = 1000) {
  let bestMapping = { ...initialMapping };
  let bestScore = scoreDecryption(applySubstitution(cipherText, bestMapping));
  let bestText = applySubstitution(cipherText, bestMapping);
  
  console.log(`\nStarting pattern matching refinement...`);
  console.log(`Initial score: ${bestScore}`);
  
  let improved = true;
  let iteration = 0;
  
  while (improved && iteration < maxIterations) {
    improved = false;
    iteration++;
    
    // Try swapping pairs of mappings
    const keys = Object.keys(bestMapping);
    for (let i = 0; i < keys.length && !improved; i++) {
      for (let j = i + 1; j < keys.length && !improved; j++) {
        // Create new mapping with swap
        const newMapping = { ...bestMapping };
        const temp = newMapping[keys[i]];
        newMapping[keys[i]] = newMapping[keys[j]];
        newMapping[keys[j]] = temp;
        
        // Score it
        const newText = applySubstitution(cipherText, newMapping);
        const newScore = scoreDecryption(newText);
        
        // Keep if better
        if (newScore > bestScore) {
          bestScore = newScore;
          bestMapping = newMapping;
          bestText = newText;
          improved = true;
          console.log(`Iteration ${iteration}: Improved score to ${bestScore} by swapping '${keys[i]}'↔'${keys[j]}'`);
        }
      }
    }
  }
  
  console.log(`Refinement complete after ${iteration} iterations. Final score: ${bestScore}\n`);
  
  return { mapping: bestMapping, text: bestText, score: bestScore };
}

// Main decoding function
function decodeCipher(cipherText, cipherName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`DECODING ${cipherName}`);
  console.log('='.repeat(60));
  
  const freq = calculateFrequency(cipherText);
  const freqMapping = createFrequencyMapping(freq);
  
  // Stage 1: Frequency Analysis Only
  const decipheredText = applySubstitution(cipherText, freqMapping);
  
  console.log('\nDeciphered Text (Frequency Analysis Only):');
  console.log('-'.repeat(60));
  console.log(decipheredText);
  console.log('-'.repeat(60));
  
  // Stage 2: Pattern Matching Refinement
  const result = refineWithPatternMatching(freqMapping, cipherText);
  
  console.log('Human Readable Text (After Pattern Matching Refinement):');
  console.log('-'.repeat(60));
  console.log(result.text);
  console.log('-'.repeat(60));
  
  return { decoded: result.text, freq, mapping: result.mapping };
}

// Main execution
console.log('SUBSTITUTION CIPHER DECODER');
console.log('Using Frequency Analysis & Pattern Matching Refinement\n');

decodeCipher(cipher1, 'CIPHER-1');
decodeCipher(cipher2, 'CIPHER-2');

// Comparative Analysis
console.log('\n' + '='.repeat(60));
console.log('COMPARATIVE ANALYSIS');
console.log('='.repeat(60));

console.log('\nExpected English Frequencies (Top 5):');
const englishSorted = sortByFrequency(englishFreq);
for (let i = 0; i < 5; i++) {
  console.log(`  ${i + 1}. '${englishSorted[i]}' - ${englishFreq[englishSorted[i]]}%`);
}

console.log('\n' + '-'.repeat(60));
console.log('WHICH CIPHER WAS EASIER TO BREAK?');
console.log('-'.repeat(60));

console.log('\nAnswer: CIPHER-2 was easier to break\n');

console.log('Reasons:');
console.log('1. LENGTH: Cipher-2 is much longer (~1800 characters vs ~450)');
console.log('   - More data provides a more accurate frequency distribution.');
console.log('   - The "law of large numbers" means statistical analysis is more reliable.');

console.log('\n2. CONTEXT & PATTERNS: More text means more recurring words and patterns.');
console.log('   - Pattern matching can identify more common words like "the", "and", etc.');
console.log('   - Easier to spot words and verify correctness through readability.');

console.log('\n3. REDUCED VARIANCE: Short texts can have skewed letter frequencies.');
console.log('   - Cipher-1 is short enough that frequencies deviate from English average.');
console.log('   - This makes pure frequency attacks less accurate.');

console.log('\n' + '='.repeat(60));











