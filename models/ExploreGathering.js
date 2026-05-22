import mongoose from 'mongoose';

const exploreGatheringSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const ExploreGathering = mongoose.model('ExploreGathering', exploreGatheringSchema);
export default ExploreGathering;
