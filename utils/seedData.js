import User from '../models/User.js';
import ExploreGathering from '../models/ExploreGathering.js';
import CuratedFormat from '../models/CuratedFormat.js';

export const seedInitialData = async () => {
  try {
    // 1. Get or create an admin user to associate with the seeded data
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.findOne({ email: 'admin@newbeginnings.com' });
    }
    
    // If no admin user exists, we can create a temporary seed user or wait
    if (!adminUser) {
      // Find any user as fallback
      adminUser = await User.findOne({});
    }

    if (!adminUser) {
      console.log('No user exists in database to assign as creator for seed data. Skipping seed.');
      return;
    }

    const createdBy = adminUser._id;

    // 2. Seed ExploreGathering
    const gatheringCount = await ExploreGathering.countDocuments();
    if (gatheringCount === 0) {
      const defaultGatherings = [
        { name: 'Supportive Circles', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80', createdBy },
        { name: 'Social Mixers', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80', createdBy },
        { name: 'Intimate Suppers', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80', createdBy },
        { name: 'Wellness & Travel', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80', createdBy }
      ];
      await ExploreGathering.insertMany(defaultGatherings);
      console.log('Successfully seeded default ExploreGatherings');
    }

    // 3. Seed CuratedFormat
    const formatCount = await CuratedFormat.countDocuments();
    if (formatCount === 0) {
      const defaultFormats = [
        {
          title: 'Growth Seminars',
          tag: 'SUPPORT & WISDOM',
          description: 'Co-parenting advice, legal coaching, and panels hosted by leading relationship advisors in sun-drenched private rooms.',
          image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80',
          createdBy
        },
        {
          title: 'Secret Suppers',
          tag: 'CANDLELIT SOCIALS',
          description: 'Intimate dinner tables capped strictly at 12 members, hosted in warm, fairy-lit hidden lofts with local chefs.',
          image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80',
          createdBy
        },
        {
          title: 'Sunset Mixers',
          tag: 'RELAXED VIBES',
          description: 'Warm acoustic jazz nights, cozy outdoor string lights, and light finger food for pressure-free socializing.',
          image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80',
          createdBy
        }
      ];
      await CuratedFormat.insertMany(defaultFormats);
      console.log('Successfully seeded default CuratedFormats');
    }
  } catch (error) {
    console.error('Error during data seeding:', error.message);
  }
};
