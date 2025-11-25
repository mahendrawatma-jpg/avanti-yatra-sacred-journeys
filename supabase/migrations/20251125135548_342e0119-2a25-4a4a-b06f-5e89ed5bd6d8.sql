
-- Create temples table for admin management
CREATE TABLE public.temples (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  district text NOT NULL,
  type text NOT NULL,
  description text,
  image_url text,
  location text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  virtual_darshan_url text,
  map_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create temple_slots table for darshan timings
CREATE TABLE public.temple_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  temple_id uuid REFERENCES public.temples(id) ON DELETE CASCADE NOT NULL,
  slot_name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  max_capacity integer DEFAULT 100,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'special')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create alerts table for admin notifications
CREATE TABLE public.alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('festival', 'crowd', 'closure', 'weather', 'vip', 'general')),
  temple_id uuid REFERENCES public.temples(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temple_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for temples (public read, admin write)
CREATE POLICY "Anyone can view temples" ON public.temples FOR SELECT USING (true);
CREATE POLICY "Admins can manage temples" ON public.temples FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for temple_slots (public read, admin write)
CREATE POLICY "Anyone can view slots" ON public.temple_slots FOR SELECT USING (true);
CREATE POLICY "Admins can manage slots" ON public.temple_slots FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for alerts (public read active, admin write)
CREATE POLICY "Anyone can view active alerts" ON public.alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage alerts" ON public.alerts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_temples_updated_at BEFORE UPDATE ON public.temples FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_temple_slots_updated_at BEFORE UPDATE ON public.temple_slots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
