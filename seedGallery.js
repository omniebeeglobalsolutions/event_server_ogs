import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gallery from './models/Gallery.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const seedGallery = async () => {
  try {
    await connectDB();

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found. Run seedAdmin.js first.');
      process.exit(1);
    }

    const galleryItems = [
      {
        category: 'dinners',
        title: 'Fairy-Lit Secret Supper',
        description: 'Intimate evening chef-table dinner capped at 12 members.',
        image: 'https://wezoree.com/upload/medialibrary/d70/azcafent0t1t9jzasrqx4gdccwohvjcm.jpg'
      },
      {
        category: 'mixers',
        title: 'Sunset Garden Cocktail Mixer',
        description: 'Warm acoustic jazz lounge gathering under beautiful dusk string lights.',
        image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80'
      },
      {
        category: 'workshops',
        title: 'Intentional Growth Seminar',
        description: 'Co-parenting and personal development panels with leading experts.',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80'
      },
      {
        category: 'dinners',
        title: 'Cozy Candlelit Loft Diner',
        description: 'Relaxed conversations and fine-dining under soft glowing ambiance.',
        image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80'
      },
      {
        category: 'mixers',
        title: 'Acoustic Lounge Mix Session',
        description: 'Members enjoying organic conversations in high-class warm-lit space.',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80'
      },
      {
        category: 'dinners',
        title: 'Outdoor Lantern Feast',
        description: 'Beautiful evening gather tables decorated with glowing ambient lanterns.',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80'
      },
      {
        category: 'workshops',
        title: 'Co-Parenting Panels & Tea',
        description: 'Interactive supportive sharing circle with relationship coaches.',
        image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80'
      },
      {
        category: 'mixers',
        title: 'Grand Gala Social Event',
        description: 'Glowing warm ballroom lights celebration mixers.',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'
      }
    ];

    const itemsToInsert = galleryItems.map(item => ({
      ...item,
      createdBy: admin._id
    }));

    await Gallery.deleteMany({});
    await Gallery.insertMany(itemsToInsert);

    console.log('Gallery seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding gallery:', error);
    process.exit(1);
  }
};

seedGallery();
