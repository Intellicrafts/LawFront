// src/utils/e2ee.js
// Native End-to-End Encryption using Web Crypto API

const getKeyMaterial = async (password) => {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
}

export const deriveKey = async (password, saltString) => {
    const keyMaterial = await getKeyMaterial(password);
    const enc = new TextEncoder();
    const salt = enc.encode(saltString);
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000, // secure iterations
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
};

// Encrypt text output is Base64 (iv + ciphertext)
export const encryptText = async (text, key) => {
    try {
        const enc = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            enc.encode(text)
        );
        const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
        combined.set(new Uint8Array(iv), 0);
        combined.set(new Uint8Array(encrypted), iv.byteLength);

        // Convert array buffer to base64
        let binary = '';
        const bytes = new Uint8Array(combined);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    } catch (e) {
        console.error('Encryption failed', e);
        return text; // failover
    }
};

export const decryptText = async (b64, key) => {
    try {
        // Assume text is not encrypted if it doesn't look like base64
        if (!b64 || typeof b64 !== 'string' || b64.length < 20 || b64.includes(' ')) {
            return b64;
        }

        const binary_string = window.atob(b64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }

        const iv = bytes.slice(0, 12);
        const data = bytes.slice(12);

        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            data
        );
        const dec = new TextDecoder();
        return dec.decode(decrypted);
    } catch (e) {
        // Fails securely when decrypting system messages or plaintext
        return b64;
    }
};
