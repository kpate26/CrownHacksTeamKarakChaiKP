import { createClient } from '@supabase/supabase-js';

const demoEvents = [
  { id: '1', title: 'Pollinator Garden Morning', organization: 'The Nature Conservancy', category: 'Environment', day: 'SAT', date: '18 MAY', distance: '1.2', duration: '3 hrs', image: 'https://images.unsplash.com/photo-1599685315640-9c7c5f6c6d3e?auto=format&fit=crop&w=900&q=80' },
  { id: '2', title: 'Pack meals for neighbors', organization: 'Loaves & Fishes', category: 'Food access', day: 'SAT', date: '18 MAY', distance: '2.4', duration: '2 hrs', image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=900&q=80' },
  { id: '3', title: 'Catawba river clean-up', organization: 'Keep Charlotte Beautiful', category: 'Community', day: 'SUN', date: '19 MAY', distance: '3.8', duration: '4 hrs', image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=900&q=80' },
  { id: '4', title: 'Walk shelter dogs', organization: 'Greater Charlotte SPCA', category: 'Animals', day: 'SUN', date: '19 MAY', distance: '4.1', duration: '2 hrs', image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=80' },
  { id: '5', title: 'Neighborhood tree planting', organization: 'TreesCharlotte', category: 'Environment', day: 'SAT', date: '25 MAY', distance: '5.2', duration: '3 hrs', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80' },
  { id: '6', title: 'Read with a young neighbor', organization: 'Read Charlotte', category: 'Community', day: 'SUN', date: '26 MAY', distance: '2.1', duration: '2 hrs', image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80' },
];

export async function getEvents() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return demoEvents;
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  return error || !data?.length ? demoEvents : data;
}