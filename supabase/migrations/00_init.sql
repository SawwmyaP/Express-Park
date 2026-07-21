-- Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student', -- student, faculty, security
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parking Lots Table
CREATE TABLE public.parking_lots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    block TEXT NOT NULL, -- The academic block it is nearest to
    capacity_car INT DEFAULT 0,
    capacity_bike INT DEFAULT 0,
    capacity_cycle INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations Table
CREATE TABLE public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    lot_id UUID REFERENCES public.parking_lots(id),
    vehicle_type TEXT NOT NULL, -- car, bike, cycle
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    qr_hash TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, active, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traffic Logs (For Campus Security)
CREATE TABLE public.traffic_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_number TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    entry_time TIMESTAMP WITH TIME ZONE,
    exit_time TIMESTAMP WITH TIME ZONE,
    camera_id TEXT, -- ID of the camera that logged it
    is_messy BOOLEAN DEFAULT FALSE, -- Flagged by YOLO if parked incorrectly
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timetables (For Surge Prediction)
CREATE TABLE public.timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    parsed_data JSONB NOT NULL, -- OCR extracted timetable data
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
