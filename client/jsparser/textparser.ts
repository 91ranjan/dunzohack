import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as vision from '@google-cloud/vision';
import * as natural from 'natural';
import * as redis from 'redis';

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable

// Instantiate a vision client
const client = new vision.ImageAnnotatorClient({
    credentials: {
        "type": "service_account",
        "project_id": "plated-magpie-248707",
        "private_key_id": "22bf52cf81d0345cde17b681171805b209c50fc7",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCMPVwn8MEeEy6E\nJk5njokN5b2EDPnu0cyl89YN1Ee13Mj095eypeQVNQocJUOkBx5t/bebFSso8P++\nbXs/1G6reln/i+TrdhTx0kw6CFAqIRGQeMBPTdeNhSh6/v6JSn0xgE26AY7RfIyb\nvGs24a9jpZ7S/i1HBB5yMVfxaldS7bKDvZJDc0+2XWPcnO+O8hRlHAdllETbnS95\nrduStpS/E2/UrHst037g9DbxGa1hw0o2TlBBmXMvDZypf0NWmzEmZT/hhXBztnBT\n3X2zFU6V+or8cdmO+pZ5KPhvEKcL55FXtQNg7nAUJdqVTPBYGEoYofKP8kFuFRRV\nXi/01cWrAgMBAAECggEAN+PKYvaNmFVPsAXuMFI7Z8j8DvD2+IkvVKIJWGiWDbII\neqxkDiQT8qm5Nj9ZpjjaFT7M2icFFON7IOLUADvCwV9ZF8GigX6FWVyU2XnvrOKR\n8/BTwCdHNRTw7ZfLTF7d5wj5sRwm1XEcPoLIfc5SzlU2p2L6G3fWRG9K26EkXR1c\nAcvbCkOsw3nriVuoR3lZBPVIsRIJnWXN/SvuAWLq65NTG/f13uBYOy5xhcf9i2xY\nAdQdY4xnfVyOKbFq/JCebZg7e8fAqbIydQ1fnxBoMGQLGKQ5aFY7vMMGU5F9GeZw\n8QcCzVAxr5bPp2p+4Ppp9OOa+dCVmfONmBdGs/MgUQKBgQDADftjyn5h6N3kbeKx\ncxIVzTi/j5tQrqfUnO5NYSsA7dRVMT20fb6MiYOBcHBftZCjXjP0SjxeKey5Zubt\najvYXDMEqFdDMf+0H3TJFzqa+SGsH6IwkvjtnM4KOHBnqGtUMrlQlrl48SF7vK13\ngCMNV3KxcQta3DZNon3Ry7qnuwKBgQC67t3yIiXXysG4q6MNC9kq923/3/F388hC\naaj52tUPnrUpPV/FiamtnQJs9alYJXkB6HSec/jMQZGhCLOqUbQ7jgh8brf584sg\nezJsVpPASHgEcIp2DihOXl6JXrN9vKdkNCRDdOFQjEt5E98V7qP/leQNyAViU+7i\na7qPhMQi0QKBgCawKl4V4pOyp1Bm2m3IsnH132KneTAtnt1zp4Wq91C+mDF5M+by\nFbqV0Qn4Lor5NmPSjEC/251UcL2AfzCAYAHbwONFTh7ZKZuNYqdHqKSjXycfUDrc\nwIyNM+xXJj2bbdOOTEpxsncsjAQzI/aYt3bukMox7YmmJsJI43OpyLYVAoGAfRYF\n8lajWAjXJInFq584DKZRNx1VaVz5rmchqT+jvrYGp7fn9DkwD3q2+s5QKSm6FWrF\nTppv684cctNt1hSiNA/Q4eL8vQcZG/0UOqaca9iSZvYf0OucUQSY4fc6yHKK2GSD\nt5fohYu7nSOM7hIoL4jPd+FWqPtdKKnJxuuii2ECgYA5YnJbYObumkxeo1YcQEsp\nvsuAWUsZ3kCiVp44kUGMZqs0oJKUcMm3bV+bkMavxYpQoTz2XxFeFD9j9+v+yM3k\nkvGBahrNzq4rtNN5IhzhYjTOyBBesZ8GoUa1j/UqMCqA18VYh1F0VQBPVK0c+2jA\n0VTepZboDT0hK6QnC55Wxg==\n-----END PRIVATE KEY-----\n",
        "client_email": "personal@plated-magpie-248707.iam.gserviceaccount.com",
        "client_id": "113031204150173451781",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/personal%40plated-magpie-248707.iam.gserviceaccount.com"
    }

});

/**
 * State manager for text processing.  Stores and reads results from Redis.
 */
class Index {
    docsClient;
    tokenClient;
    /**
     * Create a new Index object.
     */
    constructor() {
        // Connect to a redis server.
        const TOKEN_DB = 0;
        const DOCS_DB = 1;
        const PORT = process.env.REDIS_PORT || '6379';
        const HOST = process.env.REDIS_HOST || '127.0.0.1';

        this.tokenClient = redis
            .createClient(PORT, HOST, {
                db: TOKEN_DB,
            })
            .on('error', err => {
                console.error('ERR:REDIS: ' + err);
                throw err;
            });
        this.docsClient = redis
            .createClient(PORT, HOST, {
                db: DOCS_DB,
            })
            .on('error', err => {
                console.error('ERR:REDIS: ' + err);
                throw err;
            });
    }

    /**
     * Close all active redis server connections.
     */
    quit() {
        this.tokenClient.quit();
        this.docsClient.quit();
    }

    /**
     * Tokenize the given document.
     * @param {string} filename - key for the storage in redis
     * @param {string} document - Collection of words to be tokenized
     * @returns {Promise<void>}
     */
    async add(filename, document) {
        const PUNCTUATION = ['.', ',', ':', ''];
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(document);
        // filter out punctuation, then add all tokens to a redis set.
        await Promise.all(
            tokens
                .filter(token => PUNCTUATION.indexOf(token) === -1)
                .map(token => {
                    const sadd = promisify(this.tokenClient.sadd).bind(this.tokenClient);
                    return sadd(token, filename);
                })
        );
        const set = promisify(this.docsClient.set).bind(this.docsClient);
        await set(filename, document);
    }

    /**
     * Lookup files that contain a given set of words in redis
     * @param {string[]} words An array of words to lookup
     * @returns {Promise<string[][]>} Words and their arrays of matching filenames
     */
    async lookup(words) {
        return Promise.all(
            words
                .map(word => word.toLowerCase())
                .map(word => {
                    const smembers = promisify(this.tokenClient.smembers).bind(
                        this.tokenClient
                    );
                    return smembers(word);
                })
        );
    }

    /**
     * Check to see if a Document is already stored in redis.
     * @param {string} filename
     * @returns {Promise<boolean>}
     */
    async documentIsProcessed(filename) {
        const get = promisify(this.docsClient.get).bind(this.docsClient);
        const value = await get(filename);
        if (value) {
            console.log(`${filename} already added to index.`);
            return true;
        }
        if (value === '') {
            console.log(`${filename} was already checked, and contains no text.`);
            return true;
        }
        return false;
    }

    /**
     * Updates a given doc to have no text in redis.
     * @param {string} filename
     */
    async setContainsNoText(filename) {
        const set = promisify(this.docsClient.set).bind(this.docsClient);
        await set(filename, '');
    }
}

/**
 * Provide a joined string with all descriptions from the response data
 * @param {TextAnnotation[]} texts Response data from the Vision API
 * @returns {string} A joined string containing al descriptions
 */
function extractDescription(texts) {
    let document = '';
    texts.forEach(text => {
        document += text.description || '';
    });
    return document.toLowerCase();
}

/**
 * Grab the description, and push it into redis.
 * @param {string} filename Name of the file being processed
 * @param {Index} index The Index object that wraps Redis
 * @param {*} response Individual response from the Cloud Vision API
 * @returns {Promise<void>}
 */
async function extractDescriptions(filename, index, response) {
    if (response.textAnnotations.length) {
        const words = extractDescription(response.textAnnotations);
        // await index.add(filename, words);
        return words;
    } else {
        console.log(`${filename} had no discernable text.`);
        await index.setContainsNoText(filename);
    }
}

/**
 * Given a set of image file paths, extract the text and run them through the
 * Cloud Vision API.
 * @param {Index} index The stateful `Index` Object.
 * @param {string[]} inputFiles The list of files to process.
 * @returns {Promise<void>}
 */
async function getTextFromFiles(index, inputFiles) {
    // Read all of the given files and provide request objects that will be
    // passed to the Cloud Vision API in a batch request.
    const requests = await Promise.all(
        inputFiles.map(async filename => {
            const content = await readFile(filename);
            console.log(` 👉 ${filename}`);
            return {
                image: {
                    content: content.toString('base64'),
                },
                features: [{ type: 'TEXT_DETECTION' }],
            };
        })
    );

    // Make a call to the Vision API to detect text
    const results = await client.batchAnnotateImages({ requests });
    return results;
    const detections = results[0].responses;
    return await Promise.all(
        inputFiles.map(async (filename, i) => {
            const response = detections[i];
            if (response.error) {
                console.info(`API Error for ${filename}`, response.error);
                return;
            }
            return await extractDescriptions(filename, index, response);
        })
    );
}

/**
 * Main entry point for the program.
 * @param {string} inputDir The directory in which to run the sample.
 * @returns {Promise<void>}
 */
export const main = async function (inputDir) {
    const index = new Index();
    try {
        const files = await readdir(inputDir);

        // Get a list of all files in the directory (filter out other directories)
        const allImageFiles = (await Promise.all(
            files.map(async file => {
                const filename = path.join(inputDir, file);
                const stats = await stat(filename);
                if (!stats.isDirectory()) {
                    return filename;
                }
            })
        )).filter(f => !!f);

        // Figure out which files have already been processed
        let imageFilesToProcess = allImageFiles;
        /*(await Promise.all(
            allImageFiles.map(async filename => {
                const processed = await index.documentIsProcessed(filename);
                if (!processed) {
                    // Forward this filename on for further processing
                    return filename;
                }
            })
        )).filter(file => !!file);*/

        // The batch endpoint won't handle
        if (imageFilesToProcess.length > 15) {
            console.log(
                'Maximum of 15 images allowed. Analyzing the first 15 found.'
            );
            imageFilesToProcess = imageFilesToProcess.slice(0, 15);
        }

        // Analyze any remaining unprocessed files
        if (imageFilesToProcess.length > 0) {
            console.log('Files to process: ');
            return await getTextFromFiles(index, imageFilesToProcess);
        }
        console.log('All files processed!');
    } catch (e) {
        console.error(e);
    }
    index.quit();
}

/*const usage =
  'Usage: node textDetection <command> <arg> ... \n\n  Commands: analyze, lookup';
if (process.argv.length < 3) {
  throw new Error(usage);
}
const args = process.argv.slice(2);
const command = args.shift();
if (command === 'analyze') {
  if (!args.length) {
    throw new Error('Usage: node textDetection analyze <dir>');
  }
  main(args[0]).catch(console.error);
} else if (command === 'lookup') {
  if (!args.length) {
    throw new Error('Usage: node textDetection lookup <word> ...');
  }
  lookup(args).catch(console.error);
} else {
  throw new Error(usage);
}*/