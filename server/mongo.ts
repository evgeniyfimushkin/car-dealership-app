
import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017'; // Замените на URL вашего MongoDB-шардированного сервера
const dbName = 'carDealership'; // Название вашей базы данных

let client: MongoClient | null = null;
let db: any = null;

export const connectToMongo = async () => {
    if (client && db) {
        return { client, db };
    }

    try {
        // Создаем подключение к MongoDB
        client = new MongoClient(url);
        await client.connect();

        db = client.db(dbName);

        console.log('Connected to MongoDB');
        return { client, db };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

export const getDb = () => db;
