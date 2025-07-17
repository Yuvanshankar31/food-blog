import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017/tomato'; 
const client = new MongoClient(uri);
const dbName = 'Users';

export async function POST(req) {
  try {
    const { username, email, password, action } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    if (action === 'register') {
      // Check if user already exists
      const existingUser = await collection.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        return NextResponse.json({ 
          success: false, 
          message: 'User already exists' 
        }, { status: 400 });
      }

      // Register new user
      // You should hash the password in real projects!
      await collection.insertOne({ username, email, password });
      
      return NextResponse.json({ 
        success: true, 
        message: 'User registered successfully' 
      });
    } else {
      // Login authentication
      const user = await collection.findOne({ 
        $or: [
          { email, password },
          { username, password }
        ]
      });

      if (!user) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid credentials' 
        }, { status: 401 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        user: {
          username: user.username,
          email: user.email
        }
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
