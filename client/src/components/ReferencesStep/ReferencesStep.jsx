import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const MAX_REFERENCES = 3;

const ReferencesStep = ({ formData, errors, handleChange }) => {
  const [referenceCount, setReferenceCount] = useState(MAX_REFERENCES); // Set to show all references by default

  const removeReference = (index) => {
    const refNum = index + 1;
    const updatedData = { ...formData };

    delete updatedData[`ref${refNum}Name`];
    delete updatedData[`ref${refNum}Contact`];
    delete updatedData[`ref${refNum}Email`];

    handleChange({ target: { name: `ref${refNum}Name`, value: '' } }); // force rerender
  };

  const renderReference = (index) => {
    const refNum = index + 1;
  
    return (
      <div key={refNum} className="bg-gray-50 p-4 rounded-lg relative border">
        <h3 className="font-medium text-gray-800 mb-3">Reference #{refNum}</h3>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name={`ref${refNum}Name`}
              value={formData[`ref${refNum}Name`] || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg  focus:ring-primary"
              placeholder="Full name"
            />
            {errors[`ref${refNum}Name`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`ref${refNum}Name`]}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              type="tel"
              name={`ref${refNum}Contact`}
              value={formData[`ref${refNum}Contact`] || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg  focus:ring-primary"
              placeholder="Contact number"
            />
            {errors[`ref${refNum}Contact`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`ref${refNum}Contact`]}</p>
            )}
          </div>
  
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name={`ref${refNum}Email`}
              value={formData[`ref${refNum}Email`] || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg  focus:ring-primary"
              placeholder="Email address"
            />
            {errors[`ref${refNum}Email`] && (
              <p className="text-red-500 text-sm mt-1">{errors[`ref${refNum}Email`]}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-dark mb-6">Business References</h2>
      <p className="text-gray-600 mb-4"></p>

      {/* Render all three references */}
      {[...Array(MAX_REFERENCES)].map((_, idx) => renderReference(idx))}
    </motion.div>
  );
};

export default ReferencesStep;