// instructor sign up form
import { useState } from "react";

export default function NewLessonForm({ onCreateLesson }) {
  const [lessonType, setLessonType] = useState("");

  const getCurrentDate = () => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getCurrentDate());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCreateLesson(e, {
          lessonType: lessonType,
          date: date,
        });
      }}
    >
      <label htmlFor="lessonType">lesson type</label>
      <input
        name="lessonType"
        id="lessonType"
        type="text"
        required
        onChange={(e) => setLessonType(e.target.value)}
      />
      <label htmlFor="date">Date:</label>
      <input
        name="date"
        id="date"
        type="date"
        required
        value={date} // Set value to current date
        onChange={(e) => setDate(e.target.value)}
      />

      <button type="submit">create profile</button>
    </form>
  );
}
