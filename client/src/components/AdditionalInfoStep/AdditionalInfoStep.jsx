import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';

const AdditionalInfoStep = ({ 
    formData, 
    errors, 
    handleChange, 
    isSubmitted,
    file, 
    fileError, 
    handleFileChange 
}) => {


  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-dark mb-6">Additional Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visa Status</label>
          <select
            name="visaStatus"
            value={formData.visaStatus}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${
              isSubmitted && errors.visaStatus ? 'border-red-500' : 'border-gray-300'
            }`}
          >
             <option value="">Select visa status</option>
  <option value="Work Visa">Work Visa</option>
  <option value="Visit Visa">Visit Visa</option>
  <option value="Family Visa">Family Visa</option>
  <option value="Flexi Visa">Flexi Visa</option>
  <option value="Golden Visa">Golden Visa</option>
  <option value="Others">Others</option>
          </select>
          {isSubmitted && errors.visaStatus && (
            <p className="text-red-500 text-xs mt-1">{errors.visaStatus}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visa Validity Date</label>
          <input
            type="date"
            name="visaValidity"
            value={formData.visaValidity}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${
              isSubmitted && errors.visaValidity ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {isSubmitted && errors.visaValidity && (
            <p className="text-red-500 text-sm mt-1">{errors.visaValidity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expectations</label>
          <input
  type="number"
  name="expectedSalary"
  value={formData.expectedSalary}
  onChange={handleChange}
  min="0"
  className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${
    isSubmitted && errors.expectedSalary ? 'border-red-500' : 'border-gray-300'
  }`}
  placeholder="Your Expectations"
/>
          {isSubmitted && errors.expectedSalary && (
            <p className="text-red-500 text-sm mt-1">{errors.expectedSalary}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          How can you get more leads/clients effectively?
        </label>
        <textarea
          name="clientLeadsStrategy"
          value={formData.clientLeadsStrategy}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${
            isSubmitted && errors.clientLeadsStrategy ? 'border-red-500' : 'border-gray-300'
          }`}
          rows="4"
          placeholder="Describe your strategy for acquiring leads/clients"
        />
        {isSubmitted && errors.clientLeadsStrategy && (
          <p className="text-red-500 text-sm mt-1">{errors.clientLeadsStrategy}</p>
        )}
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <FaUpload className="text-3xl text-[#3B82F6] mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Upload 1 supported file: PDF, document, or image. Max 10 MB.
          </p>
          <label className="cursor-pointer bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300">
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </label>
          {file && (
            <p className="mt-2 text-sm text-gray-700">
              Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          {isSubmitted && (errors.file || fileError) && (
            <p className="text-red-500 text-sm mt-1">{errors.file || fileError}</p>
          )}
        </div>
      </div>

      {/* <div className="mt-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary"
          />
          <span className="ml-2 text-gray-700">Send me a copy of my responses</span>
        </label>
      </div> */}
    </motion.div>
  );
};

export default AdditionalInfoStep;