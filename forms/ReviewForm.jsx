import { useState } from 'react';

export default function ReviewForm({ onReview }) {
  const [firstNameValue, setFirstNameValue] = useState('');
  const [reviewValue, setReviewValue] = useState('');
  const [stars, setStars] = useState(0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onReview(e, {
          name: firstNameValue,
          reviewMessage: reviewValue,
          stars,
        });
      }}
    >
      <label htmlFor="firstName">Name</label>
      <input
        name="firstName"
        id="firstName"
        type="text"
        required
        onChange={(e) => setFirstNameValue(e.target.value)}
      />
      
      <label htmlFor="review">Review Message</label>
      <input
        name="review"
        id="review"
        type="text"
        required
        onChange={(e) => setReviewValue(e.target.value)}
      />

      <label>Stars</label>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star}>
            <input
              type="radio"
              name="stars"
              value={star}
              checked={stars === star}
              onChange={() => setStars(star)}
            />
            {star} Star{star > 1 && 's'}
          </label>
        ))}
      </div>

      <button type="submit">Leave Review</button>
    </form>
  );
}
