import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegistrationForm />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  );
}


const countries = {
  India: ["Delhi", "Mumbai", "Bangalore"],
  USA: ["New York", "Los Angeles", "Chicago"],
};
const countryPhoneCodes = {
  India: "+91",
  USA: "+1",
};

function RegistrationForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    showPassword: false,
    phoneCode: "",
    phoneNumber: "",
    country: "",
    city: "",
    pan: "",
    aadhar: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
  const newErrors = {};
  if (!form.firstName.trim()) newErrors.firstName = "First name is required";
  if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
  if (!form.username.trim()) newErrors.username = "Username is required";
  if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = "Valid email is required";
  if (!form.password) newErrors.password = "Password is required";

  if (!form.phoneCode || !form.phoneNumber) {
    newErrors.phone = "Phone number is required";
  } else {
    if (!/^\d{10}$/.test(form.phoneNumber)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (form.country && countryPhoneCodes[form.country] && form.phoneCode !== countryPhoneCodes[form.country]) {
      newErrors.phone = `Phone code for ${form.country} must be ${countryPhoneCodes[form.country]}`;
    }
  }

  if (!form.country) newErrors.country = "Country is required";
  if (!form.city) newErrors.city = "City is required";

  if (!form.pan.trim()) {
    newErrors.pan = "PAN No. is required";
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan)) {
    newErrors.pan = "Enter valid PAN (e.g., ABCDE1234F)";
  }

  if (!form.aadhar.trim()) {
    newErrors.aadhar = "Aadhar No. is required";
  } else if (!/^\d{12}$/.test(form.aadhar)) {
    newErrors.aadhar = "Aadhar must be exactly 12 digits";
  }

  return newErrors;
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));

  // Revalidate individual field
  let error = "";
  if (name === "email" && (!value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))) {
    error = "Valid email is required";
  } else if (name === "firstName" && !value.trim()) {
    error = "First name is required";
  } else if (name === "lastName" && !value.trim()) {
    error = "Last name is required";
  } else if (name === "username" && !value.trim()) {
    error = "Username is required";
  } else if (name === "password" && !value) {
    error = "Password is required";
  } else if (name === "pan" && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) {
    error = "Enter valid PAN (e.g., ABCDE1234F)";
  } else if (name === "aadhar" && !/^\d{12}$/.test(value)) {
    error = "Aadhar must be 12 digits";
  }
  

  else if ((name === "phoneNumber" || name === "phoneCode") && (!form.phoneCode || !form.phoneNumber)) {
  error = "Phone number is required";
}

  setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
};

 
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      navigate("/summary", { state: form });
    } else {
      setErrors(validationErrors);
    }
  };

  const isFormValid = Object.keys(validate()).length === 0;

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
       <h2 className="text-center "> Registration Form</h2>
      {['firstName', 'lastName', 'username', 'email', 'pan', 'aadhar'].map(field => (
        <div key={field}>
          <input
            type="text"
            name={field}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={form[field]}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
        </div>
      ))}

      <div>
        <input
          type={form.showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button
          type="button"
          onClick={() => setForm({ ...form, showPassword: !form.showPassword })}
          className="text-blue-500 text-sm mt-1"
        >
          {form.showPassword ? "Hide" : "Show"} Password
        </button>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          name="phoneCode"
          placeholder="Code"
          value={form.phoneCode}
          onChange={handleChange}
          className="border p-2 w-1/3"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          className="border p-2 w-2/3"
        />
      </div>
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

      <div>
        <select name="country" value={form.country} onChange={handleChange} className="border p-2 w-full">
          <option value="">Select Country</option>
          {Object.keys(countries).map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
      </div>

      <div>
        <select name="city" value={form.city} onChange={handleChange} className="border p-2 w-full">
          <option value="">Select City</option>
          {(countries[form.country] || []).map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
      </div>

      <button type="submit" disabled={!isFormValid} className="bg-blue-500 text-white p-2 rounded disabled:opacity-50">
        Submit
      </button>
    </form>
  );
}

function Summary() {
  const { state: data } = useLocation();

  if (!data) return <p className="text-center mt-4">No data submitted.</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Submitted Details</h2>
      <ul className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          key !== "showPassword" && (
            <li key={key}><strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}</li>
          )
        ))}
      </ul>
    </div>
  );
}

export default App;