
// supabase/functions/storage-init/index.ts
import { serve } from "https://deno.land/std@0.204.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: bucketData, error: bucketError } = await supabaseClient.storage.getBucket('avatars');
    
    if (!bucketData && !bucketError) {
      const { error } = await supabaseClient.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (error) {
        throw new Error(`Error creating avatars bucket: ${error.message}`);
      }
      
      console.log('Created avatars bucket successfully');
    } else if (bucketError) {
      // If error is not 404 (not found), it's an actual error
      if (bucketError.statusCode !== 404) {
        throw new Error(`Error checking avatars bucket: ${bucketError.message}`);
      } else {
        // If it's 404, create the bucket
        const { error } = await supabaseClient.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (error) {
          throw new Error(`Error creating avatars bucket: ${error.message}`);
        }
        
        console.log('Created avatars bucket successfully');
      }
    } else {
      console.log('Avatars bucket already exists');
    }


    try {
      const { data, error } = await supabaseClient.from('profiles').select('id').limit(1);
      
      if (!error) {

        console.log('Profiles table exists, checking for streak columns');
      } else {
        console.error('Error checking profiles table:', error);
      }
    } catch (error) {
      console.error('Error checking profiles table:', error);
    }

    return new Response(
      JSON.stringify({
        message: "Storage initialization complete",
        bucketCreated: !bucketData,
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Storage initialization error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
