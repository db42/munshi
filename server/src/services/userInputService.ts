import { Pool } from 'pg'; // Import Pool from pg
import { getLogger, ILogger } from '../utils/logger';
import { UserInputData, UserItrInputRecord } from '../types/userInput.types'; // Import the new types

const logger: ILogger = getLogger('userInputService');

/**
 * Factory function for getUserInputData service.
 * Fetches the user input JSON data for a given owner and assessment year.
 * @param pool - The configured PostgreSQL connection pool.
 * @returns An async function that takes ownerId and assessmentYear and returns UserInputData or null.
 */
export const getUserInputData = (pool: Pool) => async (
    ownerId: string,
    assessmentYear: string
): Promise<UserInputData | null> => {
    logger.info(`[UserService] Fetching input data for owner ${ownerId}, year ${assessmentYear}`);
    const query = `
        SELECT input_data
        FROM user_itr_inputs
        WHERE owner_id = $1 AND assessment_year = $2;
    `;
    try {
        const ownerIdNum = parseInt(ownerId, 10);
        if (isNaN(ownerIdNum)) {
            // Throw a specific error for the controller to catch
            throw new Error('Invalid ownerId format: Must be a number.');
        }

        const result = await pool.query<{ input_data: UserInputData }>(query, [ownerIdNum, assessmentYear]);
        if (result.rows.length > 0) {
            // Assuming the DB returns the JSON correctly typed
            return result.rows[0].input_data;
        } else {
            return null; // Indicate not found
        }
        // return null; // Placeholder remove after implementing query

    } catch (error: any) {
        // Log the underlying error
        logger.error(`[UserService] Error fetching user input data for owner ${ownerId}, year ${assessmentYear}:`, error);
        // Rethrow a generic or specific error for the controller
        if (error.message.startsWith('Invalid ownerId')) {
             throw error; // Rethrow specific format error
        }
        // You might check for specific DB errors here if needed
        throw new Error('Database error while fetching user input data.');
    }
};

/**
 * Factory function for upsertUserInputData service.
 * Inserts or updates the user input JSON data for a given owner and assessment year.
 * @param pool - The configured PostgreSQL connection pool.
 * @returns An async function that takes ownerId, assessmentYear, and inputData and returns the UserItrInputRecord.
 */
export const upsertUserInputData = (pool: Pool) => async (
    ownerId: string,
    assessmentYear: string,
    inputData: UserInputData
): Promise<UserItrInputRecord> => {
    logger.info(`[UserService] Upserting input data for owner ${ownerId}, year ${assessmentYear}`);
    const query = `
        INSERT INTO user_itr_inputs (owner_id, assessment_year, input_data, input_schema_version, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (owner_id, assessment_year)
        DO UPDATE SET
            input_data = EXCLUDED.input_data,
            input_schema_version = EXCLUDED.input_schema_version,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *; -- Return the full row after insert/update
    `;
    // Extract schema version or use default
    const inputSchemaVersion = inputData.inputSchemaVersion || '1.0';

    try {
        // Validate ownerId format
        const ownerIdNum = parseInt(ownerId, 10);
        if (isNaN(ownerIdNum)) {
            throw new Error('Invalid ownerId format: Must be a number.');
        }

        const result = await pool.query<UserItrInputRecord>(query, [ownerIdNum, assessmentYear, inputData, inputSchemaVersion]);
        if (result.rows.length === 0) {
            // Should not happen with RETURNING * on upsert, but good to check
             throw new Error('Database error: Upsert operation failed to return record.');
        }
        return result.rows[0]; // Return the full upserted record

    } catch (error: any) {
        logger.error(`[UserService] Error upserting user input data for owner ${ownerId}, year ${assessmentYear}:`, error);
         if (error.message.startsWith('Invalid ownerId')) {
             throw error; // Rethrow specific format error
        }
        // Check for potential DB constraint errors, etc.
        // E.g., if (error.code === '23505') { throw new Error('DB constraint violation.'); }
        throw new Error('Database error while upserting user input data.');
    }
};
