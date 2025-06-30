-- Create the media_items table
CREATE TABLE IF NOT EXISTS media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  cover_url TEXT,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('anime', 'movie', 'series', 'game', 'album')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch')),
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  platform VARCHAR(100),
  personal_score INTEGER CHECK (personal_score >= 1 AND personal_score <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on content_type and status for faster filtering
CREATE INDEX IF NOT EXISTS idx_media_items_content_type ON media_items(content_type);
CREATE INDEX IF NOT EXISTS idx_media_items_status ON media_items(status);
CREATE INDEX IF NOT EXISTS idx_media_items_date_added ON media_items(date_added);
CREATE INDEX IF NOT EXISTS idx_media_items_personal_score ON media_items(personal_score);

-- Insert some sample data
INSERT INTO media_items (title, content_type, status, platform, personal_score, notes, cover_url) VALUES
('Attack on Titan', 'anime', 'completed', 'Crunchyroll', 9, 'Increíble historia y animación', '/placeholder.svg?height=300&width=200'),
('The Last of Us', 'game', 'completed', 'PlayStation', 10, 'Obra maestra del gaming', '/placeholder.svg?height=300&width=200'),
('Stranger Things', 'series', 'watching', 'Netflix', 8, 'Muy entretenida, esperando nueva temporada', '/placeholder.svg?height=300&width=200'),
('Dune', 'movie', 'completed', 'HBO Max', 9, 'Visualmente espectacular', '/placeholder.svg?height=300&width=200'),
('Random Access Memories', 'album', 'completed', 'Spotify', 8, 'Daft Punk en su mejor momento', '/placeholder.svg?height=300&width=200');
