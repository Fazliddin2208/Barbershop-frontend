export {
  createAppointment,
  getAppointment,
  listAppointments,
  listBarbers,
  listDaySlots,
  listServiceOptions,
  updateAppointmentStatus,
} from "./api/appointment-api";
export type { Appointment, AppointmentInput, BarberOption, ServiceOption } from "./model/types";
