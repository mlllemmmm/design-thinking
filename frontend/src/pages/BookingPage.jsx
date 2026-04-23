import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  preferredDateTime: "",
  serviceType: "Physical Wellness Assessment",
};

const serviceTypes = [
  "Physical Wellness Assessment",
  "Mental Wellness Assessment",
  "Emotional Wellness Assessment",
  "Organizational Wellness Consultation",
];

export default function BookingPage() {
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormData(initialForm);
  };

  return (
    <div className="wellness-page">
      <section className="wellness-hero-card">
        <p className="wellness-eyebrow">Appointments</p>
        <h1>Book a Wellness Consultation</h1>
        <p>
          Schedule your preferred session time and our team will reach out to
          confirm your slot.
        </p>
      </section>

      <section className="wellness-card booking-card">
        <h2>Appointment Details</h2>
        <form className="wellness-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Phone
            <input
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </label>

          <label>
            Preferred Date & Time
            <input
              required
              type="datetime-local"
              name="preferredDateTime"
              value={formData.preferredDateTime}
              onChange={handleChange}
            />
          </label>

          <label className="full-width">
            Service Type
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
            >
              {serviceTypes.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>

          <button className="btn full-width" type="submit">
            Confirm Appointment Request
          </button>
        </form>

        {submitted && (
          <p className="wellness-success">
            Appointment request submitted successfully. This is a demo flow;
            your booking is simulated on the frontend.
          </p>
        )}
      </section>
    </div>
  );
}
