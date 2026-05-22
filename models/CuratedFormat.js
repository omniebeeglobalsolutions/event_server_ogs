import mongoose from 'mongoose';

const curatedFormatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  description: {
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

const CuratedFormat = mongoose.model('CuratedFormat', curatedFormatSchema);
export default CuratedFormat;
