# Dashboard Table Format Conversion

## Changes Needed in Dashboard.jsx

Replace the card grid section (around line 1163) with this table format:

```jsx
) : (
  <div className="mt-4 overflow-x-auto">
    <table className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg`}>
      <thead className={`${darkMode ? 'bg-gray-700' : 'bg-[#DC2626]'} text-white`}>
        <tr>
          <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Nationality</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Education</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
          <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence>
          {filteredEntries.map((entry, index) => (
            <motion.tr
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className={`border-b transition-colors hover:bg-opacity-50 ${
                darkMode 
                  ? 'border-gray-700 hover:bg-gray-700' 
                  : 'border-gray-200 hover:bg-gray-50'
              } ${entry.isBlacklisted ? 'opacity-40' : ''}`}
            >
              {/* Name Column */}
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    darkMode ? 'bg-indigo-900' : 'bg-red-50'
                  }`}>
                    <span className={`font-semibold ${darkMode ? 'text-indigo-300' : 'text-[#DC2626]'}`}>
                      {entry.fullName?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {entry.fullName || 'No Name'}
                    </p>
                    {entry.skills && (
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {entry.skills.split(',').slice(0, 2).join(', ')}
                        {entry.skills.split(',').length > 2 && '...'}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Email Column */}
              <td className="px-4 py-3">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {entry.email}
                </p>
              </td>

              {/* Contact Column */}
              <td className="px-4 py-3">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {entry.mobileContact}
                </p>
              </td>

              {/* Nationality Column */}
              <td className="px-4 py-3">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {entry.nationality}
                </p>
              </td>

              {/* Education Column */}
              <td className="px-4 py-3">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {entry.educationLevel}
                </p>
              </td>

              {/* Employment Status Column */}
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  String(entry.currentlyEmployed).toUpperCase() === 'YES'
                    ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                }`}>
                  {String(entry.currentlyEmployed).toUpperCase() === 'YES' ? 'Employed' : 'Available'}
                </span>
              </td>

              {/* Date Column */}
              <td className="px-4 py-3">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(entry.submittedAt).toLocaleDateString()}
                </p>
              </td>

              {/* Actions Column */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-center space-x-2">
                  {entry.resumeFile && (
                    <a
                      href={entry.resumeFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-colors ${
                        darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title="Download Resume"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiDownload className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlacklistToggle(entry);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      entry.isBlacklisted 
                        ? 'bg-[#DC2626] text-white hover:bg-[#DC2626]/80' 
                        : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title={entry.isBlacklisted ? 'Remove from Blacklist' : 'Add to Blacklist'}
                  >
                    <FiShield className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(entry);
                      setTimeout(() => setIsEditMode(true), 100);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(entry);
                    }}
                    className="p-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#DC2626]/80 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openModal(entry)}
                    className="px-3 py-2 bg-[#DC2626] text-white text-xs rounded-lg hover:bg-[#DC2626]/80 transition-colors font-medium"
                  >
                    View
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  </div>
)
```

## What to Replace

Find this section in Dashboard.jsx (around line 1163):

```jsx
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
    <AnimatePresence>
      {filteredEntries.map((entry) => (
        <motion.div
          // ... card layout code ...
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
)
```

Replace the entire card grid section with the table format above.

## Benefits

- **More compact**: Shows more candidates on screen
- **Better scanning**: Table format is easier to scan
- **Professional**: Standard admin panel layout
- **Responsive**: Horizontal scroll on mobile
- **All features preserved**: Blacklist, edit, delete, view, download resume
