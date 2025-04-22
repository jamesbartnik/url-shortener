import pkg from 'aws-sdk';
import { nanoid } from 'nanoid';

const localUrlStore: Record<string, string> = {};

// Initialize DynamoDB client
const { DynamoDB } = pkg;

const dynamoDB = new DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || 'us-west-2',
});

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'UrlShortener';

// Generate a short code for URLs
export function generateShortCode(): string {
    return nanoid(8); // 8-character unique ID
}

// Save URL to DynamoDB
export async function saveUrl(shortCode: string, originalUrl: string): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
        const params = {
            TableName: TABLE_NAME,
            Item: {
                shortCode,
                originalUrl,
                createdAt: new Date().toISOString()
            }
        };
        try {
            await dynamoDB.put(params).promise();
            console.log("Saved URL", params.Item);
        } catch (err) {
            console.error("Dynamo put failed:", err);
            throw err;    // or return a 500 from your route
        }
    } else {
        // Local development - store in memory
        localUrlStore[shortCode] = originalUrl;
    }
}

// Get original URL from short code
export async function getOriginalUrl(shortCode: string): Promise<string | null> {
    if (process.env.NODE_ENV === 'production') {
        const params = {
            TableName: TABLE_NAME,
            Key: { shortCode }
        };
        const result = await dynamoDB.get(params).promise();
        return result.Item ? result.Item.originalUrl : null;
    } else {
        // Local development - retrieve from memory
        return localUrlStore[shortCode] || null;
    }
}