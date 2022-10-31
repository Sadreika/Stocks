import axios from "axios";

export interface IMethodResult<T> {
  success: boolean;
  message: string;
  content: T;
}

export const validateToken = async (): Promise<boolean> => {
  const token = localStorage.getItem("BearerToken");
  await axios
    .get<void>(`https://localhost:7074/Token/ValidateToken`, {
      params: {
        stringToken: token,
      },
    })
    .catch((error) => {
      switch (error.response.status) {
        case 403:
          window.location.href = "/Login";
          break;
        case 400:
          break;
        default:
          window.location.href = `/Error?status=${error.response.status}`;
          break;
      }

      return false;
    });

  return true;
};
