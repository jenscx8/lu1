import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";

export async function studentDashboardLoader() {
    try {
        const res = await axios.get(`/api/student-dashboard`);
        return { student: res.data };
    } catch (error) {
        console.error("Error loading data:", error);
        return { error: error.message };
    }
}

export default function StudentDashboard() {
  const {
    student: { firstName, lastName, email, password },
  } = useLoaderData();

  return (
    <>
      <h1>
        {firstName} {lastName}
      </h1>

      <p>{email}</p>
      <p>{password}</p>

    </>
  );
}
