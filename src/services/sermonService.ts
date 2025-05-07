
import { supabase } from "@/integrations/supabase/client";
import { Sermon } from "@/types/sermons";

/**
 * Fetch all sermons from the database
 */
export const fetchSermons = async () => {
  const { data, error, count } = await supabase
    .from('sermons')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });
      
  if (error) {
    console.error("Supabase query error:", error);
    throw error;
  }
  
  return { data: data || [], count: count || 0 };
};

/**
 * Add a sermon to the database
 */
export const addSermon = async (sermon: Omit<Sermon, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('sermons')
    .insert(sermon)
    .select('*')
    .single();
  
  if (error) throw error;
  
  return data;
};

/**
 * Update a sermon in the database
 */
export const updateSermon = async (id: string, sermon: Partial<Sermon>) => {
  const { error } = await supabase
    .from('sermons')
    .update(sermon)
    .eq('id', id);
  
  if (error) throw error;
  
  return true;
};

/**
 * Get a single sermon by id
 */
export const getSermon = async (id: string) => {
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  return data as Sermon;
};

/**
 * Delete a sermon from the database
 */
export const deleteSermon = async (id: string) => {
  // Get the sermon to find associated files
  const { data: sermon, error: fetchError } = await supabase
    .from('sermons')
    .select('audio_url, cover_image')
    .eq('id', id)
    .single();
  
  if (fetchError) {
    console.warn("Could not fetch sermon before deletion:", fetchError);
  }
  
  // Delete the sermon record
  const { error } = await supabase
    .from('sermons')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  
  return { sermon, success: true };
};
