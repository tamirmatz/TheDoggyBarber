// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5029/DogBarber';

const APPOINTMENTS_ENDPOINTS = {
  addAppointment: 'AddAppointment',
  deleteAppointment: 'DeleteAppointment',
  updateAppointment: 'UpdateAppointment',
  getAppointments: 'GetAppointments'
}


export interface Appointment {
    appointmentId: number;
    userId: number;
    firstName: string;
    appointmentTime: string;
    createdTime: string;
  }

  export enum GeneralStatusCodes {
    Success = 0,
    Failure = 1,
  }

  export interface AddAppointmentRequest {
    userId: number;
    firstName: string;
    appointmentTime: string;
  }

  export interface AddAppointmentResponse {
    appointmentId: number;
    status: GeneralStatusCodes;
  }

  export interface GetAppointmentsResponse {
    appointments: Appointment[];
    status: GeneralStatusCodes;
  }

  export interface UpdateAppointmentsRequest {
    appointmentId: number;
    appointmentTime: string;
  }


// Mock appointment data



// Simulate fetching appointments
export const fetchAppointments = async (): Promise<GetAppointmentsResponse> => {

    const response = await axios.get(`${API_BASE_URL}/${APPOINTMENTS_ENDPOINTS.getAppointments}`);
    return response.data;

};

export const addAppointment = async (request: AddAppointmentRequest): Promise<AddAppointmentResponse> => {

  const response = await axios.post(`${API_BASE_URL}/${APPOINTMENTS_ENDPOINTS.addAppointment}`, request, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const updateAppointment = async (request: UpdateAppointmentsRequest): Promise<GeneralStatusCodes> => {

  const response = await axios.put(`${API_BASE_URL}/${APPOINTMENTS_ENDPOINTS.updateAppointment}`, request, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const deleteAppointment = async (appointmentId: number): Promise<GeneralStatusCodes> => {
  const response = await axios.delete(`${API_BASE_URL}/${APPOINTMENTS_ENDPOINTS.deleteAppointment}?appointmentId=${appointmentId}`);
  return response.data;
};
