import mongoose from 'mongoose'

const MONGODB_URI = "mongodb+srv://admin:admin@cluster0.kw9ng.mongodb.net/Hackathontop1";

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local',
    )
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            console.log('Db connected')
            return mongoose
        })
    }
    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export default dbConnect
//
// import { MongoClient } from 'mongodb';
//
// const uri = "mongodb://127.0.0.1:27017";  // Thay bằng MongoDB URI của bạn
//
// let client;
// let clientPromise;
//
// if (!process.env.MONGODB_URI) {
//     throw new Error('Please add your Mongo URI to .env.local');
// }
//
// if (process.env.NODE_ENV === 'development') {
//     if (!global._mongoClientPromise) {
//         client = new MongoClient(uri);
//         global._mongoClientPromise = client.connect();
//     }
//     clientPromise = global._mongoClientPromise;
// } else {
//     client = new MongoClient(uri);
//     clientPromise = client.connect();
// }
//
// export default clientPromise;
