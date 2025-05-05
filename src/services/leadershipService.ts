import { supabase } from "@/integrations/supabase/client";
import { Leader } from "@/types/leadership";

// Map database position names to order numbers
export const positionOrder: Record<string, number> = {
  "Pastor/President": 1,
  "Assistant Pastor/VP": 2,
  "General Secretary": 3,
  "Assistant Secretary & Treasurer": 4,
  "P.R.O & Financial Secretary": 5,
  "Provost": 6
};

// Map database schema to our interface
export const mapDbLeaderToLeader = (dbLeader: any): Leader => ({
  id: dbLeader.id,
  name: dbLeader.name,
  position: dbLeader.position,
  initial: dbLeader.initial,
  bio: dbLeader.bio || undefined,
  profileImage: dbLeader.profile_image || undefined,
  socialMedia: {
    facebook: dbLeader.facebook_url || undefined,
    twitter: dbLeader.twitter_url || undefined,
    instagram: dbLeader.instagram_url || undefined,
    linkedin: dbLeader.linkedin_url || undefined,
  }
});

// Fetch all leaders from database
export const fetchLeadersFromDb = async (): Promise<Leader[]> => {
  const { data, error } = await supabase
    .from('leaders')
    .select('*')
    .order('position_order', { ascending: true });
  
  if (error) throw error;
  
  if (data && data.length > 0) {
    return data.map(mapDbLeaderToLeader);
  }
  
  return [];
};

// Get default leaders if needed
export const getDefaultLeaders = (): Leader[] => {
  return [
    {
      name: "Emmanuel R.C. Moghalu",
      position: "Pastor/President",
      initial: "EM",
      bio: "Leading with vision and purpose",
    },
    {
      name: "Chisom C. Mbagwu",
      position: "Assistant Pastor/VP",
      initial: "CM",
      bio: "Supporting the team and community",
    },
    {
      name: "Joshua E. Aforue",
      position: "General Secretary",
      initial: "JA",
      bio: "Keeping records and documentation",
    },
    {
      name: "Emmanuella Y. Ufe",
      position: "Assistant Secretary & Treasurer",
      initial: "EU",
      bio: "Managing resources and finances",
    },
    {
      name: "Dorci F. Donald",
      position: "P.R.O & Financial Secretary",
      initial: "DD",
      bio: "Maintaining public relations",
    },
    {
      name: "Samuel C. Oyenze",
      position: "Provost",
      initial: "SO",
      bio: "Ensuring order and discipline",
    }
  ];
};

// Add a leader to the database
export const addLeaderToDatabase = async (leader: Leader): Promise<{ data: any; error: any }> => {
  // Get position order from the positionOrder object
  const position_order = positionOrder[leader.position] || 99;
  
  return await supabase.from('leaders').insert({
    name: leader.name,
    position: leader.position,
    initial: leader.initial,
    bio: leader.bio || null,
    profile_image: leader.profileImage || null,
    facebook_url: leader.socialMedia?.facebook || null,
    twitter_url: leader.socialMedia?.twitter || null,
    instagram_url: leader.socialMedia?.instagram || null,
    linkedin_url: leader.socialMedia?.linkedin || null,
    position_order: position_order
  }).select('*').single();
};

// Update a leader in the database
export const updateLeaderInDatabase = async (id: string, updatedData: Partial<Leader>): Promise<{ error: any }> => {
  // Calculate position_order if position is being updated
  const position_order = updatedData.position ? (positionOrder[updatedData.position] || 99) : undefined;
  
  // Update database
  const dbUpdateData = {
    name: updatedData.name,
    position: updatedData.position,
    initial: updatedData.initial,
    bio: updatedData.bio,
    profile_image: updatedData.profileImage,
    facebook_url: updatedData.socialMedia?.facebook,
    twitter_url: updatedData.socialMedia?.twitter,
    instagram_url: updatedData.socialMedia?.instagram,
    linkedin_url: updatedData.socialMedia?.linkedin,
    position_order: position_order
  };
  
  // Remove undefined values (keep nulls)
  Object.keys(dbUpdateData).forEach(key => {
    if (dbUpdateData[key as keyof typeof dbUpdateData] === undefined) {
      delete dbUpdateData[key as keyof typeof dbUpdateData];
    }
  });
  
  return await supabase
    .from('leaders')
    .update(dbUpdateData)
    .eq('id', id);
};

// Delete a leader from the database
export const deleteLeaderFromDatabase = async (id: string): Promise<{ error: any }> => {
  return await supabase
    .from('leaders')
    .delete()
    .eq('id', id);
};
