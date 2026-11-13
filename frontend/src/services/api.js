
const API_URL = import.meta.env.VITE_API_URL;

export async function predictCarPrice(carData) {
  if (!API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(carData),
  });

  if (!response.ok) {
    throw new Error(
      `Prediction request failed (${response.status}).`
    );
  }

  return response.json();
}
