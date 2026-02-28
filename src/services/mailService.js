import apiClient from '../api/apiService';

export const mailService = {
  send: async ({
    to,
    subject,
    message,
    heading,
    actionText,
    actionUrl,
    meta = {},
  }) => {
    const payload = {
      to: Array.isArray(to) ? to : [to],
      subject,
      message,
      heading,
      action_text: actionText,
      action_url: actionUrl,
      meta,
    };

    const response = await apiClient.post('/mail/send', payload);
    return response.data;
  },

  sendContact: async (contact) => {
    const payload = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      service: contact.service || '',
      subject: contact.subject || '',
      message: contact.message,
    };

    const response = await apiClient.post('/contacts', payload);
    return response.data;
  },

  bookAppointmentAndNotify: async (appointmentPayload) => {
    // Backend sends professional mail notifications automatically
    // to both user and lawyer on successful booking.
    const response = await apiClient.post('/appointments', appointmentPayload);
    return response.data;
  },
};

export default mailService;
