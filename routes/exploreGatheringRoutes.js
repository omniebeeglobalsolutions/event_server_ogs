import express from 'express';
import { getExploreGatherings, createExploreGathering, updateExploreGathering, deleteExploreGathering } from '../controllers/exploreGatheringController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getExploreGatherings)
  .post(protect, admin, createExploreGathering);

router.route('/:id')
  .put(protect, admin, updateExploreGathering)
  .delete(protect, admin, deleteExploreGathering);

export default router;
