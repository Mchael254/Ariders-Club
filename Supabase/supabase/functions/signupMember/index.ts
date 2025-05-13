import { createClient } from 'https://esm.sh/@supabase/supabase-js';
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const supUrl = Deno.env.get('_SUPABASE_URL') as string;
const supKey = Deno.env.get('_SUPABASE_SERVICE_KEY') as string;
const supabase = createClient(supUrl, supKey);

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cache-control',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password, first_name, middle_name = '',  last_name, phone_number, role = 'member', profile_image = '', membership_contribution = 0,
      county = '', city = '', gender = '', dob = '', home_phone = '', work_phone = '', emergency_phone = ''
     } = await req.json();

    const { data, error: signupError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, profile_image, membership_contribution, first_name, last_name, middle_name, county, city, gender, dob, phone_number, home_phone,work_phone,emergency_phone },
    });

    if (signupError || !data?.user?.id) {
      return new Response(JSON.stringify({ error: signupError?.message ?? 'Signup failed' }), { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 });
    }

    const userId = data.user.id;

    const { error: insertError } = await supabase.from('members').insert([{ id: userId, first_name, last_name, role, email, phone_number }]);

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 });
    }

    return new Response(JSON.stringify({ message: 'success' }), { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request payload or server error.' }), { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 });
  }
});
