import { useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

export default function AddToLesson({ onAddToLesson }) {
  const [lessonId, setLessonId] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAddToLesson(e, {
          lessonId: lessonId,
        });
      }}
    >
      <label htmlFor="lessonId">lesson code</label>
      <input
        name="lessonId"
        id="lessonId"
        type="text"
        required
        onChange={(e) => setLessonId(e.target.value)}
      />

      <button type="submit">add to lesson</button>
    </form>
  );
}
