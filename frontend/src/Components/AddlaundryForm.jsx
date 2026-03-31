import React, { useState } from "react";
import {
  Save,
  Image as ImageIcon,
  Building2,
  MapPin,
  FileText,
  Star,
  MessageSquare,
  Clock,
  Shield,
  CheckCircle,
  Shirt
} from "lucide-react";

import "../AddLaundryForm.css";

const AddLaundryForm = ({ onAddLaundry }) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    rating: "",
    reviews: "",
    time: "",
    image: null,
    verified: false,
    status:"Open",
  });

  const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState("");
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const addService = () => {
    if (serviceInput.trim()) {
      setServices([...services, serviceInput]);
      setServiceInput("");
    }
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddLaundry({
      ...formData,
      services,
      image: preview,
    });

    setFormData({
      title: "",
      location: "",
      description: "",
      rating: "",
      reviews: "",
      time: "",
      image: null,
      verified: false,
      status: "Open",
    });

    setServices([]);
    setPreview(null);
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <h3>
        <Shirt size={24} color="#4fc2c8" /> Informations de la laverie
      </h3>

      {/* NOM & ADRESSE */}
      <div className="row">
        <div className="field">
          <label><Building2 size={18} /> Nom</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nom de la laverie"
            required
          />
        </div>

        <div className="field">
          <label><MapPin size={18} /> Adresse / Distance</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ex: 1.2 km"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="field">
        <label><FileText size={18} /> Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description de la laverie"
        />
      </div>

      {/* NOTE / AVIS / HORAIRES */}
      <div className="row">
        <div className="field">
          <label><Star size={18} /> Note</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="4.8"
          />
        </div>

        <div className="field">
          <label><MessageSquare size={18} /> Avis</label>
          <input
            type="number"
            name="reviews"
            value={formData.reviews}
            onChange={handleChange}
            placeholder="120"
          />
        </div>

        <div className="field">
          <label><Clock size={18} /> Horaires</label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="24 hours"
          />
        </div>
      </div>

      {/* IMAGE */}
      <div className="field">
        <label><ImageIcon size={18} /> Image</label>
        <label className="image-label">
          Choisir une image
          <input type="file" accept="image/*" onChange={handleChange} />
        </label>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="preview" />
          </div>
        )}
      </div>

      {/* SERVICES */}
      <div className="field">
        <label><CheckCircle size={18} /> Services</label>
        <div className="services">
          <input
            type="text"
            placeholder="Ajouter un service..."
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
          />
          <button type="button" onClick={addService}>+</button>
        </div>

        <div className="services-list">
          {services.map((srv, i) => (
            <span key={i} onClick={() => removeService(i)}>
              {srv} ✕
            </span>
          ))}
        </div>
      </div>

      {/* VERIFIED & STATUS */}
      <div className="row switches">
        <div className="reda">
        <label>
          Vérifié<span className="afellad"><Shield size={18} /></span> </label>
          <input
            type="checkbox"
            name="verified"
            checked={formData.verified}
            onChange={handleChange}
          />
        </div>
        <div className="reda">
        <label>
          Statut <span className="afelladdd"><Clock size={18} style={{color:'green'}}/></span> </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        
        </div>
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <button type="reset" className="btn-cancel">Annuler</button>
        <button type="submit" className="btn-save">
          <Save size={16} /> Enregistrer
        </button>
      </div>
    </form>
  );
};

export default AddLaundryForm;