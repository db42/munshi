import express from 'express';
import { itrGenerator } from '../generators/itr/itr';
// import { generateITR } from '@/services/itrService';

const router = express.Router();

router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        const { userId, assessmentYear, taxRegimePreference } = req.body;

        if (!userId || !assessmentYear) {
            return res.status(400).json({ error: 'userId and assessmentYear are required' });
        }
        
        const itrData = await itrGenerator.generateITR(
            parseInt(userId),
            assessmentYear,
            taxRegimePreference
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