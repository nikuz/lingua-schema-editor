import express from 'express';
import {
    translationController,
    imagesController,
} from './controllers';

const router = express.Router();
router.post('/translate', translationController.translate);
router.get('/images', imagesController.get);

export default router;
