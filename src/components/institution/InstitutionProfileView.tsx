import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Save,
  MapPin,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  Layers,
  Calendar,
  CheckCircle2,
  Camera,
} from 'lucide-react';

export const InstitutionProfileView: React.FC = () => {
  const {
    institutionSettings,
    updateInstitutionSettings,
    collegeInfo,
    updateCollegeInfo,
    isDarkMode,
    showToast,
  } = useApp();

  const [name, setName] = useState(
    institutionSettings.name || collegeInfo?.name || 'Apex National Institute of Technology'
  );
  const [aisheCode, setAisheCode] = useState('C-18492');
  const [establishedYear, setEstablishedYear] = useState(
    institutionSettings.establishedYear || '1998'
  );
  const [accreditation, setAccreditation] = useState('NAAC Grade A++ (Score 3.82) • NBA Tier-1');
  const [nirfRank, setNirfRank] = useState('Rank 24 (Engineering Category)');
  const [location, setLocation] = useState(
    institutionSettings.location ||
      collegeInfo?.location ||
      'Knowledge Innovation Corridor, Sector 62, Noida, Uttar Pradesh 201309'
  );
  const [website, setWebsite] = useState(
    institutionSettings.website || 'https://apextech.edu.in'
  );
  const [email, setEmail] = useState(
    institutionSettings.contactEmail || 'director.office@apextech.edu.in'
  );
  const [phone, setPhone] = useState(
    institutionSettings.phone || '+91 (0120) 240-8900'
  );
  const [about, setAbout] = useState(
    institutionSettings.about ||
      'Apex National Institute of Technology is an autonomous institution of national prominence accredited with NAAC Grade A++ and Tier-1 NBA status. Dedicated to advancing multidisciplinary engineering, applied science, AI research, and industry-partnered experiential learning.'
  );

  // TPO Details
  const [tpoHead, setTpoHead] = useState('Prof. Vikram Singhania');
  const [tpoEmail, setTpoEmail] = useState('placements@apextech.edu.in');
  const [tpoPhone, setTpoPhone] = useState('+91 (0120) 240-8945');
  const [tpoOffice, setTpoOffice] = useState('Training & Placement Block, 2nd Floor, Main Campus');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist to context
    updateInstitutionSettings({
      name,
      location,
      website,
      contactEmail: email,
      phone,
      about,
      establishedYear,
    });

    if (updateCollegeInfo) {
      updateCollegeInfo({
        name,
        location,
        establishedYear: Number(establishedYear) || 1998,
      });
    }

    showToast('College profile and accreditation metadata updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-lime-400" />
            <span>Institution & College Profile</span>
          </h2>
          <p className="text-xs text-gray-400">
            Manage official institution branding, AISHE verification, accreditation credentials, and placement cell contacts.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Core Identity */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="pb-4 border-b border-gray-100 dark:border-white/5 mb-4">
            <h3 className="text-sm font-bold tracking-tight">Institutional Identity</h3>
            <p className="text-xs text-gray-400">Official recognized university / college credentials</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Institution Legal Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-bold text-xs ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">AISHE Institutional Code</label>
                <input
                  type="text"
                  value={aisheCode}
                  onChange={(e) => setAisheCode(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-mono text-xs ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Established Year</label>
                <input
                  type="text"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none text-xs ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">NAAC & NBA Accreditation</label>
                <input
                  type="text"
                  value={accreditation}
                  onChange={(e) => setAccreditation(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none text-xs ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">NIRF Ranking Metric</label>
                <input
                  type="text"
                  value={nirfRank}
                  onChange={(e) => setNirfRank(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none text-xs ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Campus Physical Address *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none text-xs ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Official Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none text-xs ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Registrar Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none text-xs ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Official Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none text-xs ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Institutional Overview & Vision Statement</label>
              <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none text-xs leading-relaxed ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Training & Placement Office (TPO) Details */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <div className="pb-4 border-b border-gray-100 dark:border-white/5 mb-4">
            <h3 className="text-sm font-bold tracking-tight">Training & Placement Office (TPO)</h3>
            <p className="text-xs text-gray-400">Primary point of contact for campus recruiters and corporate HRs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Head of Placements (Dean / Director)</label>
              <input
                type="text"
                value={tpoHead}
                onChange={(e) => setTpoHead(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Placement Cell Email</label>
              <input
                type="email"
                value={tpoEmail}
                onChange={(e) => setTpoEmail(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Placement Desk Phone</label>
              <input
                type="text"
                value={tpoPhone}
                onChange={(e) => setTpoPhone(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Placement Cell Office Location</label>
              <input
                type="text"
                value={tpoOffice}
                onChange={(e) => setTpoOffice(e.target.value)}
                className={`w-full p-2.5 rounded-xl border outline-none ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Accreditation Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
