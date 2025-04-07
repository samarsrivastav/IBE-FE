import axios from "axios";

export const sendConfirmationEmail = async (confirmationId: string | undefined, email: string) => {
    console.log(email, confirmationId)
  try {
    const response = await axios.post(import.meta.env.VITE_EMAIL_API_URL, {
      confirmationId,
      email,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error sending confirmation email:", error?.response?.data || error.message);
    throw error;
  }
};
