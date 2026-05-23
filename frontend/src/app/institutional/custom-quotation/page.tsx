"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function CustomQuotationPage() {
  const [formData, setFormData] = useState({
    institution: "",
    department: "",
    contactName: "",
    email: "",
    phone: "",
    requirements: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const submissions = JSON.parse(localStorage.getItem("ke_custom_quotations") || "[]");
      submissions.push({ ...formData, submittedAt: new Date().toISOString() });
      localStorage.setItem("ke_custom_quotations", JSON.stringify(submissions));
      alert("Your custom quotation request has been recorded. Our team will contact you shortly.");
      // Reset form
      setFormData({ institution: "", department: "", contactName: "", email: "", phone: "", requirements: "" });
    }
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution || !formData.contactName || !formData.requirements) {
      alert("Please fill in the Institution Name, Contact Name, and Requirements first.");
      return;
    }
    const message = `Hello Khush Enterprises,\n\nI would like to request a custom quotation:\n- Institution: ${formData.institution}\n- Department: ${formData.department}\n- Contact Person: ${formData.contactName}\n- Email: ${formData.email}\n- Phone: ${formData.phone}\n- Requirements: ${formData.requirements}`;
    const url = `https://wa.me/919890011762?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-theme text-theme flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-theme border border-theme/10 rounded-xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-black text-theme mb-6">Custom Quotation Request</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="Institution Name"
            className="bg-theme border border-theme/10 focus:border-theme text-theme px-4 py-2 rounded w-full"
            required
          />
          <input
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department / Division"
            className="bg-theme border border-theme/10 focus:border-theme text-theme px-4 py-2 rounded w-full"
            required
          />
          <input
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="Contact Person"
            className="bg-theme border border-theme/10 focus:border-theme text-theme px-4 py-2 rounded w-full"
            required
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="bg-theme border border-theme/10 focus:border-theme text-theme px-4 py-2 rounded w-full"
            required
          />
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="bg-theme border border-theme/10 focus:border-theme text-theme px-4 py-2 rounded w-full"
            required
          />
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Detailed requirements, specifications, quantities, etc."
            rows={5}
            className="bg-theme border border-theme/10 focus:border-theme text-theme px-4 py-2 rounded w-full resize-none"
            required
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-theme hover:bg-theme text-theme py-2.5 rounded font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            Submit Request <ArrowRight size={16} />
          </button>
          
          <button
            type="button"
            onClick={handleWhatsAppSubmit}
            className="px-5 py-2.5 bg-theme hover:bg-theme text-theme rounded font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(37,211,102,0.15)]"
            title="Submit request via WhatsApp"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.227 5.227 0 00-.571-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Send WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}
