import { useState } from "react";

export default function EditForm({ onEdit }) {
  const [locationValue, setLocationValue] = useState("");
  const [certificationValue, setCertificationValue] = useState("");
  const [bioValue, setValueBio] = useState("");
  // more values

  return (
    <form
      onSubmit={(e) => {
        onEdit(e, {
          bio: bioValue,
          location: locationValue,
          certification: certificationValue,
        });
      }}
    >
      <label htmlFor="bio">bio:</label>
      <input
        name="bio"
        id="bio"
        type="text"
        required
        onChange={(e) => setValueBio(e.target.value)}
      />
      <label htmlFor="location">location:</label>
      <input
        name="location"
        id="location"
        type="text"
        required
        onChange={(e) => setLocationValue(e.target.value)}
      />
      <label htmlFor="certification">Certifications:</label>
      <input
        name="certification"
        id="certification"
        type="text"
        required
        onChange={(e) => setCertificationValue(e.target.value)}
      />
      <button type="submit">edit profile</button>
    </form>
  );
}
