CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    artist_name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    social_instagram VARCHAR(255),
    social_youtube VARCHAR(255),
    social_spotify VARCHAR(255),
    social_vk VARCHAR(255),
    role VARCHAR(50) DEFAULT 'artist',
    total_tracks INT DEFAULT 0,
    total_streams BIGINT DEFAULT 0,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

ALTER TABLE tracks ADD COLUMN user_id INT REFERENCES users(id);
CREATE INDEX idx_tracks_user_id ON tracks(user_id);