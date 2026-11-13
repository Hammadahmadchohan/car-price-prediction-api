
import { useState } from "react";
import Select from "react-select";

// Predefined dropdown options
const dropdownOptions = {
  name: [
    "Maruti Swift Dzire VDI",
    "Maruti Alto 800 LXI",
    "Maruti Baleno Delta",
    "Hyundai i20 Sportz",
    "Hyundai Creta 1.6 CRDi",
    "Honda City i VTEC",
    "Tata Nexon XZ Plus",
    "Toyota Innova Crysta",
    "Mahindra Scorpio S10",
    "Renault Kwid RXT",
  ],

  year: Array.from(
    { length: 32 },
    (_, i) => String(2026 - i)
  ),

  km_driven: [
    "5000",
    "10000",
    "20000",
    "30000",
    "45000",
    "50000",
    "75000",
    "100000",
    "125000",
    "145500",
    "150000",
    "200000",
  ],

  fuel: ["Petrol", "Diesel", "CNG", "LPG"],

  mileage: [
    "12 kmpl",
    "15 kmpl",
    "18 kmpl",
    "20 kmpl",
    "21.5 kmpl",
    "23.4 kmpl",
    "25 kmpl",
    "30 kmpl",
  ],

  engine: [
    "796 CC",
    "998 CC",
    "1197 CC",
    "1248 CC",
    "1498 CC",
    "1598 CC",
    "1995 CC",
    "2179 CC",
  ],

  max_power: [
    "40 bhp",
    "60 bhp",
    "74 bhp",
    "82 bhp",
    "90 bhp",
    "110 bhp",
    "120 bhp",
    "150 bhp",
    "190 bhp",
  ],

  torque: [
    "60Nm@ 3500rpm",
    "90Nm@ 3500rpm",
    "113Nm@ 4200rpm",
    "150Nm@ 4500rpm",
    "190Nm@ 2000rpm",
    "200Nm@ 1750rpm",
    "250Nm@ 1500rpm",
    "320Nm@ 1750rpm",
  ],

  seats: ["2", "4", "5", "6", "7", "8"],

  seller_type: [
    "Individual",
    "Dealer",
    "Trustmark Dealer",
  ],

  transmission: ["Manual", "Automatic"],

  owner: [
    "First Owner",
    "Second Owner",
    "Third Owner",
    "Fourth & Above Owner",
    "Test Drive Car",
  ],
};

// Form initial state
const initialData = {
  name: "",
  year: "",
  km_driven: "",
  fuel: "",
  seller_type: "",
  transmission: "",
  owner: "",
  mileage: "",
  engine: "",
  max_power: "",
  torque: "",
  seats: "",
};

// Form steps
const groups = [
  {
    title: "Vehicle Identity",
    icon: "🚘",
    description: "Let's get to know your car",
    fields: [
      { key: "name", label: "Car Model" },
      { key: "year", label: "Manufacturing Year" },
      { key: "km_driven", label: "Kilometers Driven" },
      { key: "fuel", label: "Fuel Type" },
    ],
  },
  {
    title: "Performance & Specs",
    icon: "⚡",
    description: "Tell us what powers your vehicle",
    fields: [
      { key: "mileage", label: "Mileage" },
      { key: "engine", label: "Engine Capacity" },
      { key: "max_power", label: "Maximum Power" },
      { key: "torque", label: "Torque" },
      { key: "seats", label: "Seating Capacity" },
      { key: "transmission", label: "Transmission" },
    ],
  },
  {
    title: "Ownership Details",
    icon: "🛡️",
    description: "Almost there! Just a few final details",
    fields: [
      { key: "seller_type", label: "Seller Type" },
      { key: "owner", label: "Ownership History" },
    ],
  },
];

export default function CarForm({
  onPredict,
  loading,
  onChange,
}) {
  const [form, setForm] = useState(initialData);
  const [step, setStep] = useState(0);

  const group = groups[step];

  function update(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear old prediction when input changes
    onChange?.();
  }

  function submit(event) {
    event.preventDefault();

    if (loading) return;

    if (step < groups.length - 1) {
      setStep((previous) => previous + 1);
      return;
    }

    // Ensure every field has been selected
    const allFields = groups.flatMap(
      (item) => item.fields
    );

    const missingField = allFields.find(
      (field) => form[field.key] === ""
    );

    if (missingField) {
      const missingStep = groups.findIndex(
        (item) =>
          item.fields.some(
            (field) => field.key === missingField.key
          )
      );

      setStep(missingStep);
      return;
    }

    // Send correct data types to FastAPI
    onPredict({
      ...form,
      year: Number(form.year),
      km_driven: Number(form.km_driven),
      seats: Number(form.seats),
    });
  }

  const progress =
    ((step + 1) / groups.length) * 100;

  return (
    <section className="form-card">
      {/* Progress header */}
      <div className="progress-header">
        <span>YOUR VEHICLE PROFILE</span>
        <span>
          STEP {step + 1} OF {groups.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <div
          style={{
            width: `${progress}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Step navigation */}
      <div className="steps-nav">
        {groups.map((item, index) => (
          <button
            key={item.title}
            type="button"
            disabled={loading || index > step}
            className={`step-pill ${
              step === index ? "active" : ""
            } ${
              index < step ? "completed" : ""
            }`}
            onClick={() => setStep(index)}
          >
            <span>
              {index < step ? "✓" : index + 1}
            </span>
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      {/* Current step heading */}
      <div className="form-heading">
        <div className="section-icon">
          {group.icon}
        </div>

        <div>
          <h2>{group.title}</h2>
          <p>{group.description}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submit}>
        <div className="form-grid">
          {group.fields.map((field) => (
            <label
              className="field"
              key={field.key}
            >
              <span>{field.label}</span>

           
<Select
  classNamePrefix="car-select"
  unstyled
  isSearchable
  isDisabled={loading}
  placeholder={`Search or select ${field.label}`}
  options={dropdownOptions[field.key].map((option) => ({
    label: option,
    value: option,
  }))}
  value={
    form[field.key]
      ? {
          label: String(form[field.key]),
          value: String(form[field.key]),
        }
      : null
  }
  onChange={(selected) => {
    update({
      target: {
        name: field.key,
        value: selected?.value ?? "",
      },
    });
  }}
  noOptionsMessage={() => "No matching options"}
/>
            </label>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="form-actions">
          {step > 0 && (
            <button
              type="button"
              className="back-btn"
              disabled={loading}
              onClick={() =>
                setStep((previous) => previous - 1)
              }
            >
              ← Previous
            </button>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "✦ AI is analyzing..."
              : step === groups.length - 1
              ? "✦ Predict My Car Price"
              : "Continue →"}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="form-bottom">
        <span>
          🔒 Your details are used for prediction
        </span>
        <span>Powered by AI</span>
      </div>
    </section>
  );
}
