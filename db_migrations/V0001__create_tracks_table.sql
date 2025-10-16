CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    artist_name VARCHAR(255) NOT NULL,
    track_title VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    release_date DATE,
    genre VARCHAR(100),
    cover_url TEXT,
    audio_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMP,
    moderated_by VARCHAR(255)
);

CREATE INDEX idx_tracks_status ON tracks(status);
CREATE INDEX idx_tracks_submitted_at ON tracks(submitted_at DESC);