export type Appointment = {
  id: string;
  status: string;
  note: string | null;
  bookedAt: string;
  user: { id: string; name: string; phone: string | null };
  service: { id: string; name: string; durationMin: number; price: number } | null;
  timeslot: {
    id: string;
    startTime: string;
    date: string;
    barber: { id: string; name: string };
  };
};

export type AppointmentInput = {
  name: string;
  phone: string;
  barberId: string;
  date: string;
  startTime: string;
  serviceId?: string;
  note?: string;
};

export type BarberOption = {
  id: string;
  name: string;
  workStart: string;
  workEnd: string;
};

export type ServiceOption = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};
