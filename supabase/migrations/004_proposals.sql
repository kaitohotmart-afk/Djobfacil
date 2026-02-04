-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Allow conversation participants to view proposals
CREATE POLICY "Participants can view proposals" 
  ON proposals FOR SELECT 
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

-- Allow users to create proposals (must be sender and part of conversation validation should happen in app logic or trigger, 
-- but strict RLS for insert usually checks auth.uid() = sender_id)
CREATE POLICY "Users can insert their own proposals" 
  ON proposals FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Allow updates (Accept/Reject by receiver, Cancel by sender)
CREATE POLICY "Users can update proposals" 
  ON proposals FOR UPDATE 
  USING (auth.uid() IN (sender_id, receiver_id));

-- Add proposal_id to messages to link them
ALTER TABLE messages ADD COLUMN IF NOT EXISTS proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'text'; -- ensure type exists if not already
