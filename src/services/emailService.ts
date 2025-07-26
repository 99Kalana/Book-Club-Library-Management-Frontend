
import { apiClient } from "./apiClient";


interface SendOverdueNotificationsPayload {
    readerIds: string[];
}


interface SendEmailResponse {
    message: string;
    sentCount?: number;
}


export const sendOverdueNotifications = async (payload: SendOverdueNotificationsPayload): Promise<SendEmailResponse> => {
    const response = await apiClient.post<SendEmailResponse>("/notifications/send-overdue-emails", payload);
    return response.data;
};
