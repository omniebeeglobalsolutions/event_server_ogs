import express from 'express';
import { getCuratedFormats, createCuratedFormat, updateCuratedFormat, deleteCuratedFormat } from '../controllers/curatedFormatController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCuratedFormats)
  .post(protect, admin, createCuratedFormat);

router.route('/:id')
  .put(protect, admin, updateCuratedFormat)
  .delete(protect, admin, deleteCuratedFormat);

export default router;
