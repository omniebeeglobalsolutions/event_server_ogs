import mongoose from 'mongoose';
import Event from './models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkEvents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");
    const events = await Event.find({});
    console.log(`Found ${events.length} total events in database:`);
    events.forEach(e => {
      console.log(`- Title: "${e.title}", ID: ${e._id}, isPublished: ${e.isPublished}, Category: ${e.category}, AgeLimit: ${e.ageLimit}`);
    });
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkEvents();
