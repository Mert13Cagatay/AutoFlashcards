-- Create flashcards table
CREATE TABLE flashcards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    review_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    next_review_date TIMESTAMPTZ
);

-- Create study_sessions table
CREATE TABLE study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    flashcard_ids UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_studied_at TIMESTAMPTZ,
    total_cards INTEGER DEFAULT 0,
    completed_cards INTEGER DEFAULT 0,
    accuracy_rate DECIMAL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for flashcards (allow all operations for authenticated users based on user_id)
CREATE POLICY "Users can only access their own flashcards" ON flashcards
    FOR ALL USING (user_id = auth.uid()::text);

-- Create policies for study_sessions (allow all operations for authenticated users based on user_id)
CREATE POLICY "Users can only access their own study sessions" ON study_sessions
    FOR ALL USING (user_id = auth.uid()::text);

-- Alternatively, if you want to disable RLS for development (ONLY for development!)
-- ALTER TABLE flashcards DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE study_sessions DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_category ON flashcards(category);
CREATE INDEX idx_flashcards_difficulty ON flashcards(difficulty);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
