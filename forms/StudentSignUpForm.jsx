// instructor sign up form
import { useState } from "react";

export default function StudentSignUpForm({ onSignup }) {
  const [emailValue, setEmailValue] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  // add more values

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSignup(e, {
          email: emailValue,
          password: passwordValue,
          firstName: firstNameValue,
          lastName: lastNameValue,
        });
      }}
    >
      <label htmlFor="firstName">first name:</label>
      <input
        name="firstName"
        id="firstName"
        type="text"
        required
        onChange={(e) => setFirstNameValue(e.target.value)}
      />
      <label htmlFor="lastName">last name:</label>
      <input
        name="lastName"
        id="lastName"
        type="text"
        required
        onChange={(e) => setLastNameValue(e.target.value)}
      />

      <label htmlFor="email">Email:</label>
      <input
        name="email"
        id="email"
        type="text"
        required
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        name="password"
        id="password"
        type="password"
        required
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <button type="submit">create profile</button>
    </form>
  );
}
