
// This is an edge function that runs our SQL migration for the get_user_email function

export async function handler(req, res) {
  try {
    // Get supabase client using the service role key
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // SQL for the get_user_email function
    const sql = `
      CREATE OR REPLACE FUNCTION public.get_user_email(user_uid UUID)
      RETURNS TEXT
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public, auth
      AS $$
      DECLARE
          user_email TEXT;
      BEGIN
          SELECT email INTO user_email
          FROM auth.users
          WHERE id = user_uid;
          
          RETURN user_email;
      END;
      $$;
    `;
    
    // Execute the SQL
    const { error } = await supabaseAdmin.rpc('run_sql', { sql_query: sql });
    
    if (error) {
      throw error;
    }
    
    res.status(200).json({ success: true, message: "SQL migration completed successfully" });
  } catch (error) {
    console.error("Error in SQL migration:", error);
    res.status(500).json({ 
      success: false, 
      message: "SQL migration failed", 
      error: error.message 
    });
  }
}

import { createClient } from '@supabase/supabase-js';

// Function to run our SQL migration
export const run_sql_migration = async () => {
  try {
    // SQL for the get_user_email function
    const sql = `
      CREATE OR REPLACE FUNCTION public.get_user_email(user_uid UUID)
      RETURNS TEXT
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public, auth
      AS $$
      DECLARE
          user_email TEXT;
      BEGIN
          SELECT email INTO user_email
          FROM auth.users
          WHERE id = user_uid;
          
          RETURN user_email;
      END;
      $$;
    `;
    
    // Execute the SQL
    const { data, error } = await supabaseAdmin.rpc('run_sql', { sql_query: sql });
    
    if (error) {
      throw error;
    }
    
    return { success: true, message: "SQL migration completed successfully" };
  } catch (error) {
    console.error("Error in SQL migration:", error);
    return { 
      success: false, 
      message: "SQL migration failed", 
      error: error.message 
    };
  }
};
