import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVER_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// export const login = async (email: string, password: string) => {
//   let { user, error } = await supabase.auth.signIn({ email, password });

//   if (error) { throw error; }

//   return user;
// }
