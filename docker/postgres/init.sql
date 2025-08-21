-- Create database if not exists
SELECT 'CREATE DATABASE transparencia'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'transparencia')\gexec

-- Connect to the database
\c transparencia;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create indexes for better performance
-- These will be created by SQLAlchemy migrations, but we can prepare them

-- Function to generate protocol numbers for e-SIC
CREATE OR REPLACE FUNCTION generate_esic_protocol()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_part TEXT;
    protocol TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    
    -- Get next sequence number for the year
    SELECT LPAD((COUNT(*) + 1)::TEXT, 6, '0') INTO sequence_part
    FROM esic_requests 
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
    
    protocol := year_part || sequence_part;
    
    RETURN protocol;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function for full-text search
CREATE OR REPLACE FUNCTION create_search_vector(
    title TEXT DEFAULT '',
    description TEXT DEFAULT '',
    content TEXT DEFAULT ''
)
RETURNS tsvector AS $$
BEGIN
    RETURN to_tsvector('portuguese', 
        COALESCE(title, '') || ' ' || 
        COALESCE(description, '') || ' ' || 
        COALESCE(content, '')
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE transparencia TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

