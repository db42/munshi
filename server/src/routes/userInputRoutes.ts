import express, { Request, Response } from 'express';
// Removed controller import
// Import the instantiated service object and logger
import { userInput } from '../services/userInput';
import { logger } from '../utils/logger';

const router = express.Router();

// --- GET Handler Logic --- (Moved from controller)
const handleGetUser = async (req: Request, res: Response): Promise<void> => {
    const { ownerId, assessmentYear } = req.params;
    logger.info(`[Route] Handling GET /api/user-inputs/${ownerId}/${assessmentYear}`);
    try {
        const data = await userInput.get(ownerId, assessmentYear);

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(200).json({ message: 'User input data not found.' });
        }
    } catch (error: any) {
        logger.error(`[Route] Error in GET /api/user-inputs for owner ${ownerId}, year ${assessmentYear}:`, error);
        if (error.message.includes('Invalid ownerId')) {
             res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to fetch user input data.', details: error.message });
        }
    }
};

// --- PUT Handler Logic --- (Moved from controller)
const handleUpsertUser = async (req: Request, res: Response): Promise<void> => {
    const { ownerId, assessmentYear } = req.params;
    const inputData = req.body;
    logger.info(`[Route] Handling PUT /api/user-inputs/${ownerId}/${assessmentYear}`);

    if (!inputData || Object.keys(inputData).length === 0) {
        res.status(400).json({ error: 'Request body cannot be empty.' });
        return;
    }

    try {
        // TODO: Implement detailed validation of inputData structure here (using Zod ideally)
        const result = await userInput.upsert(ownerId, assessmentYear, inputData);
        res.status(200).json({ message: 'User input data saved successfully.', data: result });

    } catch (error: any) {
        logger.error(`[Route] Error in PUT /api/user-inputs for owner ${ownerId}, year ${assessmentYear}:`, error);
        if (error.message.includes('Invalid ownerId')) {
             res.status(400).json({ error: error.message });
        } else if (error.message.includes('validation failed')) { // Placeholder for Zod error check
            res.status(400).json({ error: 'Invalid input data format.', details: error.issues });
        } else if (error.message.includes('Database error')) {
            res.status(500).json({ error: 'Failed to save user input data.', details: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
};


// Route to get user input data for a specific owner and assessment year
router.get('/:ownerId/:assessmentYear', handleGetUser); // Use the defined handler

// Route to add or update user input data for a specific owner and assessment year
router.put('/:ownerId/:assessmentYear', handleUpsertUser); // Use the defined handler

export default router; 