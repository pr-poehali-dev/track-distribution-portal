ALTER TABLE users ADD COLUMN IF NOT EXISTS about_me TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS interests TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS achievements TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS user_follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);