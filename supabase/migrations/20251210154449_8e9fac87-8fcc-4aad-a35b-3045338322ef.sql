
-- Create business_settings table for storing academy/business name
CREATE TABLE public.business_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for business_settings
CREATE POLICY "Users can view their own business settings"
ON public.business_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business settings"
ON public.business_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business settings"
ON public.business_settings
FOR UPDATE
USING (auth.uid() = user_id);

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  plan_name TEXT,
  plan_value DECIMAL(10,2),
  payment_method TEXT,
  contact TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  payment_status TEXT NOT NULL DEFAULT 'Não Pago',
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- RLS policies for students
CREATE POLICY "Users can view their own students"
ON public.students
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own students"
ON public.students
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own students"
ON public.students
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own students"
ON public.students
FOR DELETE
USING (auth.uid() = user_id);

-- Create message_logs table to track sent messages
CREATE TABLE public.message_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'payment_reminder',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  phone_number TEXT NOT NULL,
  message_content TEXT
);

-- Enable RLS
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for message_logs
CREATE POLICY "Users can view their own message logs"
ON public.message_logs
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.students s WHERE s.id = message_logs.student_id AND s.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
