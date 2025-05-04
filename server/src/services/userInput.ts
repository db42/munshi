import pool from '../config/database'; // Assuming pool is configured and exported here
import * as userInputService from './userInputService';

/**
 * Exported object containing instantiated user input service functions.
 */
export const userInput = {
    /**
     * Fetches the user input JSON data for a given owner and assessment year.
     */
    get: userInputService.getUserInputData(pool),
    /**
     * Inserts or updates the user input JSON data for a given owner and assessment year.
     */
    upsert: userInputService.upsertUserInputData(pool)
}; 