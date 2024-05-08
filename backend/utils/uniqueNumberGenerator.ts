import { randomBytes } from 'crypto';

export const generateUniqueNumber = (): string => {
    const bytes = randomBytes(8); // Generates 8 bytes of random data
    let number = parseInt(bytes.toString('hex'), 16).toString(); // Convert bytes to a base-10 number
    return number.substr(0, 16); // Ensures the number is 16 digits long
};
