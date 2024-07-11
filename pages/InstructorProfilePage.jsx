// instructor profile
import React, { useEffect, useState } from "react";
import ReviewForm from "../forms/ReviewForm.jsx";
import { useLoaderData } from "react-router-dom";
import axios from "axios";

export async function instructorLoader({ params }) {
    try {
        const res = await axios.get(`/api/instructors/${params.instructorId}`);
        return { instructor: res.data };
    } catch (error) {
        console.error("Error loading data:", error);
        return { error: error.message };
    }
}

export default function InstructorProfilePage() {
  const {
    instructor: {
      instructorId,
      firstName,
      lastName,
      bio,
      location,
      certification,
      socials,
    },
  } = useLoaderData();

  // handle review here
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(
          `/api/review/${instructorId}/reviews`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    }

    fetchReviews();
  }, [instructorId]);

  // Calculate total stars
  const totalStars = reviews.reduce((total, review) => total + review.stars, 0);

  // Function to render star rating
  const renderStarRating = (stars) => {
    const starIcons = [];
    for (let i = 0; i < stars; i++) {
      starIcons.push(
        <span key={`star-${i}`} className="star">
          &#9733;
        </span>
      );
    }
    return starIcons;
  };

  const reviewListItems = reviews.map(
    ({ reviewId, name, reviewMessage, stars }) => (
      <li key={reviewId}>
        <div>{name}</div>
        <div>
          <p>{reviewMessage}</p>
        </div>
        <div>{renderStarRating(stars)}</div>
      </li>
    )
  );

  const handleAddReview = async (e, formData) => {
    e.preventDefault();
    const res = await axios.post(
      `/api/review/${instructorId}/leave-review`,
      formData
    );
    navigate("/");
  };

  return (
    <>
      <div className="content">
        <div className="name-photo-location-wrapper">
          <img
            className="profile-picture"
            src={
              "https://images.pexels.com/photos/10112476/pexels-photo-10112476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            }
            alt={`${firstName} ${lastName} Profile Picture`}
          />

          <div className="name">
            <h1 className="instructor-name">
              {firstName} {lastName}
            </h1>
            <div className="location">
              <p>Location: {location}</p>
            </div>

            <div className="certifications">
              Certification:
              <div className="tags">
                <div className="tag">{certification}</div>
              </div>
            </div>

            <div className="star-rating">
              <p>Star Rating: {totalStars}</p>
            </div>
          </div>
        </div>

        <div className="bio">
          <p>
            Bio: Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo
            distinctio a assumenda, reiciendis sit rem exercitationem quis ipsum
            aliquam dolores aperiam qui doloremque! Voluptates praesentium eaque
            tenetur quod minus natus esse cumque eum porro eos debitis eligendi
            vero ad dolor beatae aperiam, quibusdam fuga commodi suscipit
            repudiandae aliquam doloremque ipsum, earum reiciendis. Non, autem
            animi? Dicta, sit nobis aperiam nisi quia eius, facere natus cumque
            adipisci eaque illo minima quam velit libero perferendis! Magni,
            hic. Repellendus corporis ipsa ipsam similique facere. Quae porro
            officiis in architecto culpa ratione perferendis at, hic nobis quam
            assumenda tempore accusamus ad deleniti laboriosam? Pariatur. {bio}
          </p>
        </div>

        <div className="review-form">
          <ReviewForm onReview={handleAddReview} />
        </div>
        <div className="review-list">
          <ul>{reviewListItems}</ul>
        </div>
      </div>
    </>
  );
}
