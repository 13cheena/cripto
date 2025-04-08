document.getElementById('cipherType').addEventListener('change', function() {
    const cipherType = this.value;
    const keyInput = document.getElementById('keyInput');
    const shiftInput = document.getElementById('shiftInput');

    if (cipherType === 'caesar') {
        keyInput.style.display = 'none';
        shiftInput.style.display = 'block';
    } else if (cipherType === 'vigenere') {
        keyInput.style.display = 'block';
        shiftInput.style.display = 'none';
    } else {
        keyInput.style.display = 'none';
        shiftInput.style.display = 'none';
    }
});

document.getElementById('encryptBtn').addEventListener('click', processText);
document.getElementById('decryptBtn').addEventListener('click', processText);

function processText(e) {
    const inputText = document.getElementById('inputText').value;
    const cipherType = document.getElementById('cipherType').value;
    const isEncrypt = e.target.id === 'encryptBtn';
    let outputText = '';

    if (cipherType === 'morse') {
        outputText = isEncrypt ? textToMorse(inputText) : morseToText(inputText);
    } else if (cipherType === 'caesar') {
        const shift = parseInt(document.getElementById('shift').value);
        outputText = isEncrypt ? caesarCipher(inputText, shift) : caesarCipher(inputText, -shift);
    } else if (cipherType === 'vigenere') {
        const key = document.getElementById('key').value;
        outputText = isEncrypt ? vigenereCipher(inputText, key) : vigenereDecipher(inputText, key);
    } else if (cipherType === 'atbash') {
        outputText = atbashCipher(inputText);
    }

    document.getElementById('outputText').value = outputText;
}

// ===== Код Морзе (с кириллицей) =====
function textToMorse(text) {
    const morseCode = {
        'А': '.-', 'Б': '-...', 'В': '.--', 'Г': '--.', 'Д': '-..', 'Е': '.', 'Ё': '.',
        'Ж': '...-', 'З': '--..', 'И': '..', 'Й': '.---', 'К': '-.-', 'Л': '.-..',
        'М': '--', 'Н': '-.', 'О': '---', 'П': '.--.', 'Р': '.-.', 'С': '...', 'Т': '-',
        'У': '..-', 'Ф': '..-.', 'Х': '....', 'Ц': '-.-.', 'Ч': '---.', 'Ш': '----',
        'Щ': '--.-', 'Ъ': '--.--', 'Ы': '-.--', 'Ь': '-..-', 'Э': '..-..', 'Ю': '..--',
        'Я': '.-.-',
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        ' ': '/', ',': '--..--', '.': '.-.-.-', '?': '..--..', '/': '-..-.', '-': '-....-'
    };

    return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
}

function morseToText(morse) {
    const morseMap = {
        '.-': 'А', '-...': 'Б', '.--': 'В', '--.': 'Г', '-..': 'Д', '.': 'Е',
        '...-': 'Ж', '--..': 'З', '..': 'И', '.---': 'Й', '-.-': 'К', '.-..': 'Л',
        '--': 'М', '-.': 'Н', '---': 'О', '.--.': 'П', '.-.': 'Р', '...': 'С', '-': 'Т',
        '..-': 'У', '..-.': 'Ф', '....': 'Х', '-.-.': 'Ц', '---.': 'Ч', '----': 'Ш',
        '--.-': 'Щ', '--.--': 'Ъ', '-.--': 'Ы', '-..-': 'Ь', '..-..': 'Э', '..--': 'Ю',
        '.-.-': 'Я',
        '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
        '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
        '/': ' ', '--..--': ',', '.-.-.-': '.', '..--..': '?', '-..-.': '/', '-....-': '-'
    };

    return morse.split(' ').map(code => morseMap[code] || code).join('');
}

// ===== Шифр Цезаря (с кириллицей) =====
function caesarCipher(text, shift) {
    const rusUpper = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    const rusLower = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    
    return text.split('').map(char => {
        if (rusUpper.includes(char)) {
            const index = (rusUpper.indexOf(char) + shift + 33) % 33;
            return rusUpper[index];
        } else if (rusLower.includes(char)) {
            const index = (rusLower.indexOf(char) + shift + 33) % 33;
            return rusLower[index];
        } else if (/[A-Z]/.test(char)) {
            const code = char.charCodeAt(0) - 65;
            return String.fromCharCode(((code + shift + 26) % 26) + 65);
        } else if (/[a-z]/.test(char)) {
            const code = char.charCodeAt(0) - 97;
            return String.fromCharCode(((code + shift + 26) % 26) + 97);
        }
        return char;
    }).join('');
}

// ===== Шифр Виженера (с кириллицей) =====
function vigenereCipher(text, key) {
    const rusAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    key = key.toUpperCase().replace(/[^А-ЯЁ]/g, '');
    let keyIndex = 0;
    
    return text.split('').map(char => {
        if (/[А-ЯЁ]/.test(char)) {
            const shift = rusAlphabet.indexOf(key[keyIndex % key.length]);
            const index = (rusAlphabet.indexOf(char) + shift) % 33;
            keyIndex++;
            return rusAlphabet[index];
        } else if (/[а-яё]/.test(char)) {
            const shift = rusAlphabet.indexOf(key[keyIndex % key.length]);
            const index = (rusAlphabet.indexOf(char.toUpperCase()) + shift) % 33;
            keyIndex++;
            return rusAlphabet[index].toLowerCase();
        } else if (/[A-Z]/.test(char)) {
            const shift = key.charCodeAt(keyIndex % key.length) - 1040; // Кириллица 'А' = 1040
            const code = char.charCodeAt(0) - 65;
            keyIndex++;
            return String.fromCharCode(((code + shift + 26) % 26) + 65);
        }
        return char;
    }).join('');
}

function vigenereDecipher(text, key) {
    const rusAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    key = key.toUpperCase().replace(/[^А-ЯЁ]/g, '');
    let keyIndex = 0;
    
    return text.split('').map(char => {
        if (/[А-ЯЁ]/.test(char)) {
            const shift = rusAlphabet.indexOf(key[keyIndex % key.length]);
            const index = (rusAlphabet.indexOf(char) - shift + 33) % 33;
            keyIndex++;
            return rusAlphabet[index];
        } else if (/[а-яё]/.test(char)) {
            const shift = rusAlphabet.indexOf(key[keyIndex % key.length]);
            const index = (rusAlphabet.indexOf(char.toUpperCase()) - shift + 33) % 33;
            keyIndex++;
            return rusAlphabet[index].toLowerCase();
        }
        return char;
    }).join('');
}

// ===== Шифр Атбаш (с кириллицей) =====
function atbashCipher(text) {
    const rusUpper = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    const rusLower = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const reversedUpper = rusUpper.split('').reverse().join('');
    const reversedLower = rusLower.split('').reverse().join('');
    
    return text.split('').map(char => {
        if (rusUpper.includes(char)) {
            return reversedUpper[rusUpper.indexOf(char)];
        } else if (rusLower.includes(char)) {
            return reversedLower[rusLower.indexOf(char)];
        } else if (/[A-Z]/.test(char)) {
            return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
        } else if (/[a-z]/.test(char)) {
            return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
        }
        return char;
    }).join('');
}
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Проверяем сохранённую тему (если есть)
if (localStorage.getItem('theme') === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '🌞 Светлая тема';
}

themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌓 Тёмная тема';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '🌞 Светлая тема';
    }
});