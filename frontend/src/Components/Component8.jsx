import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCalendarAlt, FaTruck, FaMagic } from "react-icons/fa";
import TitleSectionText from "./ui/TitleSectionText";
import Button from "./Button";

const steps = [
  {
    id: 1,
    title: "Find a Service",
    description:
      "Browse local laundry shops, compare prices and read customer reviews.",
    icon: <FaSearch />,
  },
  {
    id: 2,
    title: "Book & Schedule",
    description:
      "Select your services and schedule a convenient pickup time.",
    icon: <FaCalendarAlt />,
  },
  {
    id: 3,
    title: "We Pick Up",
    description:
      "Sit back while we collect your laundry from your doorstep.",
    icon: <FaTruck />,
  },
  {
    id: 4,
    title: "Fresh & Clean",
    description:
      "Receive your clothes fresh, clean, and ready to wear.",
    icon: <FaMagic />,
  },
];

function Component8() {
  return (
    <section className="how-section">


        <TitleSectionText
            titlePart1="How Parteners of <i>Mesbanati</i> <br/> Works"
            description={"Getting your laundry done has never been easier. Here's how it works."}
            descriptionClass="text-center mx-auto"
        />

       

      <div className="steps mt-[40px] ">
        {steps.map((step) => (
          <div className="step-card" key={step.id}>
            <div className="step-number">{step.id}</div>

            <div className="step-icon">{step.icon}</div>

            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
        
      </div>
       {/* Find Shops Button */}
       <div className="flex justify-center mt-8 mb-8">
          <Link to="/shops">
            <Button variant="primary" className="px-16 py-3 text-base">
              <FaSearch className="w-4 h-4" />
              Find Shops
            </Button>
          </Link>
        </div>
    </section>
  );
}

export default Component8;