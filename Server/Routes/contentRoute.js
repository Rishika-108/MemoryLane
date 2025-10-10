import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getUserContent, saveCapturedData } from '../Controllers/contentController.js';
import { searchContent } from '../Controllers/searchController.js';
import { getUserAnalytics } from '../Controllers/analysisController.js';
import { analyzeContent } from '../Config/ai.js';

const contentRouter = express.Router();

contentRouter.post('/save', authMiddleware, saveCapturedData);
contentRouter.get('/getContent', authMiddleware, getUserContent);
contentRouter.post('/search', authMiddleware, searchContent);
contentRouter.get('/analytics', authMiddleware, getUserAnalytics);
contentRouter.get('/:id/analyze', authMiddleware, analyzeContent);

export default contentRouter;