import express from 'express';
import { itrService } from '../services/itrService';
// import { generateITR } from '@/services/itrService';

const router = express.Router();

router.get('/:userId/:assessmentYear', async (req: express.Request, res: express.Response) => {
    try {
        const { userId, assessmentYear } = req.params;
        
        const itrData = await itrService.generateITR(
            parseInt(userId),
            assessmentYear
        );
        
        res.json(itrData);
    } catch (error) {
        console.error('Error generating ITR:', error);
        res.status(500).json({ 
            error: 'Failed to generate ITR',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;