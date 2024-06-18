const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPT_KEY, 'hex'); // Use the generated key

function encrypt(text) {
  const iv = crypto.randomBytes(16); // Generate a 16-byte IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`; // Return IV and encrypted text concatenated with a colon
}

function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(':'); // Split IV and encrypted text
  const iv = Buffer.from(ivHex, 'hex'); // Convert IV from hex to buffer
  if (iv.length !== 16) {
    throw new Error('Invalid IV length');
  }
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };