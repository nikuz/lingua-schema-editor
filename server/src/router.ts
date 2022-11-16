import express from 'express';
import { translateController } from './controllers';

const router = express.Router();
router.post('/translate', translateController.translate);

export default router;

// export default (app: Express) => {
//     app.post('/translate', translateController.translate);
// };
