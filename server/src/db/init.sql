-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY, -- Will eventually be Clerk User ID, for now just a string
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    document_type VARCHAR(50),
    state VARCHAR(20) NOT NULL DEFAULT 'uploaded',
    state_message TEXT,
    owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_year VARCHAR(7) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS parsed_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Link to the original document
    document_id UUID NOT NULL REFERENCES documents(id),
    -- Type of JSON structure (e.g., 'FORM_16_PART_A', 'FORM_16_PART_B', 'BANK_STATEMENT', 'FORM_26AS_PART_A')
    json_schema_type VARCHAR(50) NOT NULL,
    -- Schema version for this particular JSON structure type
    json_schema_version VARCHAR(20) NOT NULL DEFAULT '1.0',
    -- The actual parsed data stored as JSONB for flexible querying
    parsed_data JSONB NOT NULL,
    -- Version of the parser used (for future compatibility)
    parser_version VARCHAR(20) NOT NULL DEFAULT '1.0',
    -- Status of parsing
    state VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Any error message if parsing failed
    state_message TEXT,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create user_itr_inputs table to store manual additions/edits by the user
CREATE TABLE IF NOT EXISTS user_itr_inputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_year VARCHAR(7) NOT NULL,
    -- The user's input/additions structured as JSON
    input_data JSONB NOT NULL,
    -- Versioning for the input structure itself
    input_schema_version VARCHAR(20) NOT NULL DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Ensure only one input set per user/year
    UNIQUE (owner_id, assessment_year)
);

-- Seed initial users for local development
INSERT INTO users (id, email, first_name, last_name) VALUES
(123, 'dushyant37@gmail.com', 'dushyant', 'bansal'),
(456, 'vinodbansal1957@gmail.com', 'vinod kumar', 'bansal')
ON CONFLICT (id) DO NOTHING;
