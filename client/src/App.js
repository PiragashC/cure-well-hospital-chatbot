import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import bgImg from './imageFile/bgimg.png'
import image from "./imageFile/logo.png";
import ScrollToBottom from 'react-scroll-to-bottom';
import chatbot from './imageFile/chatbot.png';
import user from './imageFile/user.png';

function App() {

  useEffect(() => {
    let portfolioList = document.querySelectorAll('.portfolio-box');
    portfolioList.forEach(function (portfolioPic) {
      portfolioPic.addEventListener('click', function () {
        // let bg = this.style.backgroundImage;
        // document.getElementById('port_pop_pic_bg').classList.add("active")
        // document.getElementById('port_pop_pic').style.backgroundImage = bg
        // document.getElementById('port_pop_pic').classList.add("active")
      });
    })
    document.getElementById('port_pop_pic_bg').addEventListener('click', function () {
      document.getElementById('port_pop_pic_bg').classList.remove("active")
      document.getElementById('port_pop_pic').classList.remove("active")
    })
  }, [])

  const [queryResponse, setQueryResponse] = useState([
    { query: "", response: "Welcome to Cure Well Hospital. How can I help you today?" }
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResponseForQuery = async (query) => {
    let message;
    if (query) {
      message = {
        dbquery: query
      }
    } else {
      message = {
        query: userMessage
      }
    }
    // setLoadingMessage(true);
    setQueryResponse([...queryResponse, { query: (query ? query : userMessage), response: "......" }]);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASEURL}/api/query/find-matching-response`, message);
      console.log(response.data);
      setQueryResponse([...queryResponse, { query: (query ? query : userMessage), response: response.data.response }]);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data.error);
      setQueryResponse([...queryResponse, { query: (query ? query : userMessage), response: "Error, Something went wrong...." }]);
    } finally {
      setUserMessage("");
      // setSelectedQuery("");
      setQueries([]);
      // setLoadingMessage(false);
    }
  }

  const handleChange = async (e) => {

    setLoading(true);
    setUserMessage(e.target.value);
    setErrorMessage("");

    const queryString = { queryString: e.target.value }
    if (e.target.value && e.target.value !== " ") {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASEURL}/api/query/find-out-matching-queries`, queryString);
        console.log(response.data);
        setQueries(response.data);
      } catch (err) {
        console.log(err);
        setQueries([]);
      } finally{
        setLoading(false);
      }
    }
  }

  return (
    <>
      <div className="chat_icon">
        <i className="fa fa-comments" aria-hidden="true"></i>
      </div>

      {/* <div className="chat_box">
        <div className="my-conv-form-wrapper">
          <form action="" method="GET" className="hidden">
            <select
              data-conv-question="Hello! How can I help you"
              name="category"
            >
              <option value="WebDevelopment">Website Development ?</option>
              <option value="DigitalMarketing">Digital Marketing ?</option>
            </select>

            <div data-conv-fork="category">
              <div data-conv-case="WebDevelopment">
                <input
                  type="text"
                  name="domainName"
                  data-conv-question="Please, tell me your domain name"
                />
              </div>
              <div
                data-conv-case="DigitalMarketing"
                data-conv-fork="first-question2"
              >
                <input
                  type="text"
                  name="companyName"
                  data-conv-question="Please, enter your company name"
                />
              </div>
            </div>

            <input
              type="text"
              name="name"
              data-conv-question="Please, Enter your name"
            />

            <input
              type="text"
              data-conv-question="Hi {name}, <br> It's a pleasure to meet you."
              data-no-answer="true"
            />

            <input
              data-conv-question="Enter your e-mail"
              data-pattern="^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
              type="email"
              name="email"
              required
              placeholder="What's your e-mail?"
            />

            <select data-conv-question="Please Conform">
              <option value="Yes">Conform</option>
            </select>
          </form>
        </div>
      </div> */}

      <div className="wrapper">
        <div className="content">
          <div className="chat_header">
            <div className="img">
              <img src={image} alt="" />
            </div>
            <div className="right">
              <div className="name">ChatBot</div>
              <div className="status">Online</div>
            </div>
          </div>


          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}

          <ScrollToBottom className="chat-body">
            {queryResponse.length > 0 &&
              queryResponse.map((qr, index) => {
                return (
                  <div className="main" key={index}>
                    <div className="main_content">
                      <div className="messages">
                        {qr.query && (
                          <div className="human-message" id="message2">
                            <p>{qr?.query}</p>
                            <img src={user} alt='chatbot' className="user-logo" />
                          </div>
                        )}
                        <div className="bot-message" id="message1">
                        <img src={chatbot} alt='chatbot' className="chatbot-logo" />
                          <p>{qr?.response}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </ScrollToBottom>

          <div className="bottom">
            <div className="btm">
              <div className="input">
                <input
                  type="text"
                  id="input"
                  placeholder="Enter your message"
                  value={userMessage}
                  onChange={handleChange}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      fetchResponseForQuery();
                    }
                  }}
                />

                {(loading && userMessage) && <div className="loading">Loading...</div>}

                {queries.length > 0 && userMessage && (
                  <div className="seach-dropdown-area">
                    {queries.map((query, index) => {
                      return (
                        <div
                          className="seach-dropdown-data"
                          key={index}
                          onClick={() => {
                            // setSelectedQuery(query);
                            setQueries([]);
                            fetchResponseForQuery(query)
                          }}
                        >
                          {query}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="btn">
                <button
                  onClick={() => fetchResponseForQuery()} // disabled={!userMessage}
                >
                  <i className="fas fa-paper-plane me-2"></i>&nbsp;Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container-fluid">
          <div className="row d-flex justify-content-between">
            <div className="col-md-auto">
              <a href="#!" className="logo">
                <img src="images/logo.png" alt="logo" />
              </a>
            </div>
            <div className="col-md-auto">
              <nav className="main_nav">
                <ul>
                  <li>
                    <a href="#home">Home</a>
                  </li>
                  <li>
                    <a href="#about">About Us</a>
                  </li>
                  <li>
                    <a href="#portfolio">Services & Resources</a>
                  </li>
                  <li>
                    <a href="#contact">Contact Us</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div
        className="banner d-flex align-items-center"
        style={{ backgroundImage: `url(${bgImg})` }}
        id="home"
      >
        <ul className="socila_links">
          <li>
            <a href="www.example.com">
              <i className="fa-brands fa-facebook" aria-hidden="true"></i>
              {/* <i class="fa-brands fa-facebook"></i> */}
            </a>
          </li>
          <li>
            <a href="www.example.com">
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
              {/* <i class="fa-brands fa-instagram"></i> */}
            </a>
          </li>
          <li>
            <a href="www.example.com">
              <i className="fa-brands fa-twitter" aria-hidden="true"></i>
              {/* <i class="fa-brands fa-twitter"></i> */}
            </a>
          </li>
        </ul>
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="banner_cont">
                <h1>Cure Well Hospital</h1>
                <p>
                  Compassionate care, advanced healing.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section" id="about">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5 text-justify">
              <h2 className="bdr-btm">More About Cure Well</h2>
              <p>
                Cure Well Hospital is renowned for its commitment to compassionate care and advanced healing. Equipped with state-of-the-art medical technology, the hospital provides comprehensive healthcare services across various specialties. Our team of highly skilled doctors, nurses, and support staff are dedicated to ensuring the best outcomes for our patients. We prioritize personalized treatment plans, recognizing the unique needs of each individual. The hospital's serene and patient-friendly environment promotes recovery and well-being. We also emphasize continuous learning and innovation, staying at the forefront of medical advancements. At Cure Well Hospital, we strive to be your trusted partner in health, dedicated to improving lives through excellence in healthcare.
              </p>
              <a href="#contact" className="btn1">
                Contact Us
              </a>
            </div>
            <div className="col-md">
              <div className="about-box">
                <h3 className="bdr-btm">Awards and Recognitions</h3>
                <ul>
                  <li>
                    <strong>Best Multispecialty Hospital Award</strong> <br /> Recognized for providing exceptional care across various medical specialties, ensuring comprehensive treatment under one roof.
                  </li>
                  <li>
                    <strong>Excellence in Patient Care Award</strong> <br /> Honored for consistently delivering high-quality, compassionate care, prioritizing patient well-being and satisfaction.
                  </li>
                  <li>
                    <strong>Innovative Healthcare Technology Award</strong> <br /> Awarded for integrating cutting-edge medical technology and innovative treatment methods to enhance patient outcomes.
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="about-box">
                <h3 className="bdr-btm">Successful Surgeries</h3>
                <ul>
                  <li>
                    <strong>Over 5,000 successful cardiac surgeries</strong> <br /> Demonstrated expertise in performing complex heart surgeries with a high success rate, benefiting numerous patients.
                  </li>
                  <li>
                    <strong>Leading center for minimally invasive orthopedic surgeries</strong> <br /> Known for advanced orthopedic procedures that reduce recovery time and improve patient mobility.
                  </li>
                  <li>
                    <strong>High success rate in complex neurosurgeries</strong> <br /> Achieved remarkable outcomes in treating intricate neurological conditions, enhancing patient quality of life.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="portfolio-section" id="portfolio">
        <div id="port_pop_pic_bg"></div>
        <div id="port_pop_pic"></div>
        <div className="container-fluid">
          <h2 className="text-center bdr-btm bdr-btm-center">Services</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="portfolio-box" style={{ backgroundImage: `url('images/cardiology.jpg')` }}>
                <h3>Cardiology</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="portfolio-box" style={{ backgroundImage: `url('images/orthopedic.webp')` }}>
                <h3>Orthopedic</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="portfolio-box" style={{ backgroundImage: `url('images/neuro.jpeg')` }}>
                <h3>Neurology</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <h2 className="text-center bdr-btm bdr-btm-center">Doctors and Spealists</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="portfolio-box" style={{ backgroundImage: `url('images/do1.jpg')` }}>
                <h3>Dr. Samantha Rao special in Cardiology</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="portfolio-box" style={{ backgroundImage: `url('images/do2.jpg')` }}>
                <h3>Dr. Michael Singh special in Orthopedic</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="portfolio-box" style={{ backgroundImage: `url('images/do3.jpg')` }}>
                <h3>Dr. Priya Kapoor special in Neurology</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-section d-md-flex" id="contact">
        <div className="col-md-6 col-12 contact_section_left">
          <div className="contact_box">
            <i className="fa fa-phone"></i>
            <h3>Phone</h3>
            <p>512-421-3940</p>
          </div>
          <div className="contact_box">
            <i className="fa fa-envelope"></i>
            <h3>Email</h3>
            <p>curewellsupport@doc.com</p>
          </div>
          <div className="contact_box">
            <i className="fa fa-map-marker"></i>
            <h3>Address</h3>
            <p>123 Hospital Road Jaffna</p>
          </div>
        </div>
        <div className="col-md-6 col-12 contact_section_right d-flex align-items-center">
          <div className="contact_box">
            <h2 className="bdr-btm">Query Note</h2>
            <form>
              <div>
                <input type="text" name="" placeholder="Name" />
                <input type="text" name="" placeholder="Email" />
                <input type="text" name="" placeholder="Subject" />
                <textarea placeholder="Message"></textarea>
                <input
                  type="submit"
                  className="inline-block"
                  name=""
                  value="Send Message"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
