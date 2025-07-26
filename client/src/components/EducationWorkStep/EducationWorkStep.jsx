import { motion } from 'framer-motion';

const EducationWorkStep = ({ formData, errors, handleChange }) => {
  const handleSuggestionClick = (value) => {
    // create a fake event object to call handleChange
    const event = {
      target: {
        name: 'yearsOfExperience',
        value: value
      }
    };
    handleChange(event);
  };
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-dark mb-6">Education & Employment</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Highest Education Level</label>
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${errors.educationLevel ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Education Level</option>
            <option value="Secondary Level">Secondary Level</option>
<option value="College Graduate">College Graduate</option>
<option value="Post Graduate">Post Graduate</option>
<option value="Vocational">Vocational</option>
<option value="Technical">Technical</option>
<option value="Associate Diploma">Associate Diploma</option>
<option value="Others">Others</option>

          </select>
          {errors.educationLevel && <p className="text-red-500 text-xs mt-1">{errors.educationLevel}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course/Degree</label>
          <input
            type="text"
            name="courseDegree"
            value={formData.courseDegree}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${errors.courseDegree ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Your course or degree"
          />
          {errors.courseDegree && <p className="text-red-500 text-xs mt-1">{errors.courseDegree}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currently Employed?</label>
          <select
            name="currentlyEmployed"
            value={formData.currentlyEmployed}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${errors.currentlyEmployed ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select option</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
          {errors.currentlyEmployed && <p className="text-red-500 text-xs mt-1">{errors.currentlyEmployed}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position Applied For</label>
          <select
            name="employmentDesired"
            value={formData.employmentDesired}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${errors.employmentDesired ? 'border-red-500' : 'border-gray-300'}`}
          >
           <option value="">Select position</option>
  <option value="Logistic Officer">Logistic Officer</option>
  <option value="Office Admin">Office Admin</option>
  <option value="Accountant">Accountant</option>
  <option value="Business Development Manager">Business Development Manager</option>
  <option value="Freight Forwarder Agent">Freight Forwarder Agent</option>
  <option value="Others">Others</option>
          </select>
          {errors.employmentDesired && <p className="text-red-500 text-xs mt-1">{errors.employmentDesired}</p>}
        </div>
        

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">When are you available to start?</label>
          <select
            name="availableStart"
            value={formData.availableStart}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${errors.availableStart ? 'border-red-500' : 'border-gray-300'}`}
          >
 <option value="">Select option</option>
  <option value="Immediately">Immediately</option>
  <option value="After one week">After one week</option>
  <option value="After one month notice">After one month notice</option>
  <option value="Others">Others</option>
          </select>
          {errors.availableStart && <p className="text-red-500 text-xs mt-1">{errors.availableStart}</p>}
        </div>

        <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
  <div className="flex items-center">
    <input
      type="text"
      name="yearsOfExperience"
      value={formData.yearsOfExperience}
      onChange={handleChange}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-transparent ${
        errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder="Fresher or number (e.g. 1, 2, 5)"
    />
  </div>
  {typeof formData.yearsOfExperience === 'string' &&
  formData.yearsOfExperience.toLowerCase().startsWith('f') &&
  !formData.yearsOfExperience.toLowerCase().startsWith('fresher') && (

    <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white">
      <div className="py-1">
      <div
  className="px-4 py-2 text-sm cursor-pointer text-gray-800 hover:bg-gray-100"
  onClick={() => handleSuggestionClick('Fresher')}
>
  Fresher (0 years)
</div>
      </div>
    </div>
  )}
  {errors.yearsOfExperience && (
    <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience}</p>
  )}
</div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shift available to work?</label>
          <select
            name="shiftAvailable"
            value={formData.shiftAvailable}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${errors.shiftAvailable ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select shift</option>
            <option value="DAYS">Days</option>
            <option value="EVENING">Evening</option>
            <option value="GRAVEYARD">Graveyard</option>
            <option value="WEEKENDS">Weekends</option>
          </select>
          {errors.shiftAvailable && <p className="text-red-500 text-xs mt-1">{errors.shiftAvailable}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Can you travel locally/abroad if job requires?</label>
          <select
            name="canTravel"
            value={formData.canTravel}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${errors.canTravel ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select option</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
          {errors.canTravel && <p className="text-red-500 text-xs mt-1">{errors.canTravel}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Do you have driving license?</label>
          <select
            name="drivingLicense"
            value={formData.drivingLicense}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${errors.drivingLicense ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select option</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
          {errors.drivingLicense && <p className="text-red-500 text-xs mt-1">{errors.drivingLicense}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
        <textarea
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg  focus:ring-primary focus:border-transparent ${errors.skills ? 'border-red-500' : 'border-gray-300'}`}
          rows="3"
          placeholder="List your relevant skills"
        ></textarea>
        {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
      </div>
    </motion.div>
  );
};

export default EducationWorkStep;
