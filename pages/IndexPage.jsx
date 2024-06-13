import React, { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export async function indexLoader() {
    try {
      const [resortsRes, topInstructorsRes] = await Promise.all([
        axios.get("/api/resorts/all-resorts"),
        axios.get("/api/instructors/"),
      ]);
  
      return {
        resorts: resortsRes.data,
        topInstructors: topInstructorsRes.data,
      };
    } catch (error) {
      console.error("Error loading data:", error);
      return {
        resorts: [],
        topInstructors: [],
      };
    }
  }

  export default function IndexPage() {
    const { resorts, topInstructors } = useLoaderData();
    const [selectedResort, setSelectedResort] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredInstructors, setFilteredInstructors] = useState(topInstructors);
    const navigate = useNavigate();
  
    const handleResortChange = (event) => {
      const resortId = event.target.value;
      setSelectedResort(resortId);
      navigate(`/resorts/${resortId}`);
    };
  
    const handleSearch = async (event) => {
      const query = event.target.value;
      setSearchQuery(query);
  
      if (query.trim() === "") {
        setFilteredInstructors(topInstructors);
        return;
      }
  
      try {
        const response = await axios.get(`/api/search-instructors`, {
          params: { query },
        });
        setFilteredInstructors(response.data);
      } catch (error) {
        console.error("Failed to search instructors", error);
      }
    };
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
  
    return (
      <div className="">
        <div className="hero-section">
          <div className="hero-content">
            <label htmlFor="resort-select">
              <h1>Select Resort</h1>
            </label>
            <select
              className="dropdown-section"
              id="resort-select"
              onChange={handleResortChange}
              value={selectedResort}
            >
              <option value="">All Resorts</option>
              {resorts.map((resort) => (
                <option key={resort.resortId} value={resort.resortId}>
                  {resort.location}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <section className="info-section info-cards-wrapper">
          <div className="card-grid-space">
            <div className="num">01</div>
            <a
              className="info-card"
              href="https://codetheweb.blog/2017/10/06/html-syntax/"
            >
              <div>
                <h1>About Instructor App</h1>
                <p>
                  This app allows you to connect with instructors for various
                  activities at different resorts. You can create a profile, view
                  instructors, and book lessons.
                </p>
                <div className="tags">
                  <div className="tag">Code</div>
                </div>
              </div>
            </a>
          </div>
          <div className="card-grid-space">
            <div className="num">01</div>
            <a
              className="info-card"
              href="https://codetheweb.blog/2017/10/06/html-syntax/"
            >
              <div>
                <h1>Backcountry Skiing</h1>
                <p>
                  Backcountry skiing, also called off-piste or out-of-area, is skiing in the backcountry on unmarked or unpatrolled areas outside of a ski resort's boundaries. Lay down first tracks on completely untouched terrain, while immersing yourself in the wilderness of the mountains range with our guided backcountry ski tours.
                </p>
                <div className="date">6 Oct 2024</div>
                <div className="tags">
                  <div className="tag">Code</div>
                </div>
              </div>
            </a>
          </div>
          <div className="card-grid-space">
            <div className="num">01</div>
            <a
              className="info-card"
              href="https://codetheweb.blog/2017/10/06/html-syntax/"
            >
              <div>
                <h1>Observatory Overnights</h1>
                <p>
                  This is it. It's the trip you've heard legends of, epic tales of snowmobiling at twilight and back country skiing at the crack of dawn. Now is your chance to experience this icon.
                </p>
                <div className="date">6 Oct 2024</div>
                <div className="tags">
                  <div className="tag">Code</div>
                </div>
              </div>
            </a>
          </div>
        </section>
  
        <div className="instructors-section">
          <h2>Top Instructors</h2>
          <input
            type="text"
            placeholder="Search instructors by name, email, or location"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Slider {...settings}>
            {filteredInstructors.map((instructor) => (
              <div key={instructor.instructorId} className="instructor-slide">
                <Link to={`/instructors/${instructor.instructorId}`}>
                  <div className="top-instructor-card card">
                    <div className="instructor-image">
                      <img
                        src={
                          "https://images.pexels.com/photos/10112476/pexels-photo-10112476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        }
                        alt={`${instructor.firstName} ${instructor.lastName}`}
                        className="instructor-image"
                      />
                    </div>
                    <div className="name">
                      <h3>
                        {instructor.firstName} {instructor.lastName}
                      </h3>
                      <div className="location"> {instructor.location}</div>
                    </div>
  
                    <div className="view-profile">
                      <button className="cta-button">view profile</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  }
  