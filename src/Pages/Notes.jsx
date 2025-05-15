// import React, { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
// import { createPortal } from 'react-dom';

// const Notes = () => {
//   const [notes, setNotes] = useState([]);
//   const [filteredNotes, setFilteredNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingNote, setEditingNote] = useState(null);
//   const [versionHistory, setVersionHistory] = useState(null);
//   const [loadingVersions, setLoadingVersions] = useState(false);

//   const fetchNotes = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('No authentication token found');
//         Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
//         return;
//       }

//       const response = await fetch('http://localhost:5000/api/notes/get', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         const errorMsg = errorData.message || `HTTP error! status: ${response.status}`;
//         setError(errorMsg);
//         Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
//         return;
//       }

//       const result = await response.json();
//       const notesArray = Array.isArray(result) ? result : result.notes || [];
//       setNotes(notesArray);
//       setFilteredNotes(notesArray);
//     } catch (err) {
//       setError(`Network error: ${err.message}`);
//       Swal.fire({ title: 'Network Error!', text: 'Failed to connect to server', icon: 'error' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     const search = searchTerm.trim().toLowerCase();
//     if (!search) return setFilteredNotes(notes);

//     const filtered = notes.filter(note => {
//       const inTitle = note.title?.toLowerCase().includes(search);
//       const inDesc = note.description?.toLowerCase().includes(search);
//       const tags = Array.isArray(note.tags) ? note.tags : [];
//       const inTags = tags.some(tag => tag?.toLowerCase().includes(search));
//       const inVisibility = note.visibility?.toLowerCase().includes(search);
//       return inTitle || inDesc || inTags || inVisibility;
//     });

//     setFilteredNotes(filtered);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') handleSearch();
//   };

//   const handleDelete = async (noteId) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
//       return;
//     }

//     const confirm = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'This note will be permanently deleted!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         const errorMsg = errorData.message || `Error deleting note`;
//         Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
//         return;
//       }

//       Swal.fire({ title: 'Deleted!', text: 'Note deleted successfully.', icon: 'success' });
//       setNotes(prev => prev.filter(note => note._id !== noteId));
//       setFilteredNotes(prev => prev.filter(note => note._id !== noteId));
//     } catch (err) {
//       Swal.fire({ title: 'Error!', text: err.message, icon: 'error' });
//     }
//   };

//   const openEditModal = (note) => {
//     setEditingNote(note);
//   };

//   const closeEditModal = () => {
//     setEditingNote(null);
//   };

//   const saveEditedNote = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/notes/${editingNote._id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(editingNote),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         const errorMsg = errorData.message || `Failed to update note`;
//         Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
//         return;
//       }

//       Swal.fire({ title: 'Updated!', text: 'Note updated successfully.', icon: 'success' });
//       closeEditModal();
//       fetchNotes();
//     } catch (err) {
//       Swal.fire({ title: 'Error!', text: err.message, icon: 'error' });
//     }
//   };

//   const openVersionModal = async (noteId) => {
//     setLoadingVersions(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/notes/${noteId}/versions`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         const errorMsg = errorData.message || `Failed to fetch version history`;
//         Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
//         return;
//       }

//       const result = await response.json();
//       setVersionHistory({ noteId, versions: result });
//     } catch (err) {
//       Swal.fire({ title: 'Error!', text: err.message, icon: 'error' });
//     } finally {
//       setLoadingVersions(false);
//     }
//   };

//   const closeVersionModal = () => {
//     setVersionHistory(null);
//   };

//   const handleRollbackVersion = async (noteId, versionId) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
//       return;
//     }

//     const confirm = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'This will restore the selected version and overwrite the current version!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, rollback',
//     });

//     if (!confirm.isConfirmed) return;

//     try {
// const response = await fetch(`http://localhost:5000/api/notes/${noteId}/rollback`, {
//   method: 'POST',
//   headers: {
//     Authorization: `Bearer ${token}`,
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ versionIndex }), // ✅ this matches backend
// });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         const errorMsg = errorData.message || `Error rolling back version`;
//         Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
//         return;
//       }

//       Swal.fire({ title: 'Rolled Back!', text: 'Note version rolled back successfully.', icon: 'success' });
//       fetchNotes();
//       closeVersionModal();
//     } catch (err) {
//       Swal.fire({ title: 'Error!', text: err.message, icon: 'error' });
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   if (isLoading) {
//     return <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="text-xl font-semibold">Loading your notes...</div>
//     </div>;
//   }

//   if (error) {
//     return <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-lg text-center">
//         <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Notes</h2>
//         <p className="mb-4">{error}</p>
//         <button onClick={fetchNotes} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Retry</button>
//       </div>
//     </div>;
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-8">
//         <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Your Notes</h2>

//         <div className="mb-6">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Search by title, description, tags, or visibility"
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//           <button
//             onClick={handleSearch}
//             className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-lg transition duration-300"
//           >
//             Search Notes
//           </button>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {filteredNotes.length > 0 ? (
//             filteredNotes.map((note) => (
//               <div key={note._id} className="bg-white p-4 rounded shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
//                 <div className="flex flex-col justify-between">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-xl font-bold text-green-700 mb-2">{note.title || 'Untitled Note'}</h3>
//                     <button
//                       onClick={() => openVersionModal(note._id)}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
//                     >
//                       View Versions
//                     </button>
//                   </div>
//                 </div>

//                 <p className="text-gray-600 mb-3">{note.description || 'No description'}</p>

//                 {note.tags?.length > 0 && (
//                   <div className="flex flex-wrap gap-1 mb-3">
//                     {note.tags.map((tag, i) => (
//                       <span key={i} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">{tag}</span>
//                     ))}
//                   </div>
//                 )}

//                 <div className="flex justify-between items-center mt-2">
//                   <span className={`font-medium ${note.visibility === 'public' ? 'text-green-600' : 'text-red-600'}`}>
//                     {note.visibility || 'unknown'}
//                   </span>
//                   <div className="space-x-2">
//                     <button onClick={() => openEditModal(note)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-1 rounded text-sm">Edit</button>
//                     <button onClick={() => handleDelete(note._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-8 text-gray-500">
//               {notes.length === 0 ? 'You don\'t have any notes yet.' : 'No notes found.'}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editingNote && createPortal(
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
//             <h2 className="text-xl font-bold mb-4 text-green-700">Edit Note</h2>
//             <input
//               className="w-full border p-2 rounded mb-3"
//               type="text"
//               value={editingNote.title || ''}
//               onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
//               placeholder="Note Title"
//             />
//             <textarea
//               className="w-full border p-2 rounded mb-3"
//               rows="4"
//               value={editingNote.description || ''}
//               onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
//               placeholder="Note Description"
//             ></textarea>
//             <div className="flex justify-end gap-3">
//               <button onClick={closeEditModal} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
//               <button onClick={saveEditedNote} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Save</button>
//             </div>
//           </div>
//         </div>,
//         document.body
//       )}

//       {/* Version Modal */}
//       {versionHistory && createPortal(
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4 text-blue-600">Version History</h2>
//             {loadingVersions ? (
//               <p>Loading versions...</p>
//             ) : (
//               versionHistory.versions?.length > 0 ? versionHistory.versions.map((version, i) => (
//                 <div key={version._id} className="border-b pb-3 mb-3">
//                   <h3 className="text-lg font-semibold text-green-700">{version.title || 'Untitled'}</h3>
//                   <p className="text-gray-600">{version.description || 'No description'}</p>
//                   <p className="text-xs text-gray-400 mt-1">{new Date(version.createdAt).toLocaleString()}</p>
//                   <button
//                     onClick={() => handleRollbackVersion(versionHistory.noteId, version._id)}
//                     className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
//                   >
//                     Rollback to this version
//                   </button>
//                 </div>
//               )) : <p className="text-gray-500">No versions found.</p>
//             )}
//             <div className="flex justify-end">
//               <button onClick={closeVersionModal} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-3">Close</button>
//             </div>
//           </div>
//         </div>,
//         document.body
//       )}
//     </div>
//   );
// };

// export default Notes;













import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createPortal } from 'react-dom';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [versionHistory, setVersionHistory] = useState(null);
  const [loadingVersions, setLoadingVersions] = useState(false);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
        return;
      }

      const response = await fetch('http://localhost:5000/api/notes/get', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `HTTP error! status: ${response.status}`;
        setError(errorMsg);
        Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
        return;
      }

      const result = await response.json();
      const notesArray = Array.isArray(result) ? result : result.notes || [];
      setNotes(notesArray);
      setFilteredNotes(notesArray);
    } catch (err) {
      setError(`Network error: ${err.message}`);
      Swal.fire({ title: 'Network Error!', text: 'Failed to connect to server', icon: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return setFilteredNotes(notes);

    const filtered = notes.filter(note => {
      const inTitle = note.title?.toLowerCase().includes(search);
      const inDesc = note.description?.toLowerCase().includes(search);
      const tags = Array.isArray(note.tags) ? note.tags : [];
      const inTags = tags.some(tag => tag?.toLowerCase().includes(search));
      const inVisibility = note.visibility?.toLowerCase().includes(search);
      return inTitle || inDesc || inTags || inVisibility;
    });

    setFilteredNotes(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleDelete = async (noteId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
      return;
    }

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This note will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Error deleting note`;
        Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
        return;
      }

      Swal.fire({ title: 'Deleted!', text: 'Note deleted successfully.', icon: 'success' });
      setNotes(prev => prev.filter(note => note._id !== noteId));
      setFilteredNotes(prev => prev.filter(note => note._id !== noteId));
    } catch (err) {
      Swal.fire({ title: 'Error!', text: err.message, icon: 'error' });
    }
  };

  const openEditModal = (note) => {
    setEditingNote({ ...note });
  };

  const closeEditModal = () => {
    setEditingNote(null);
  };

  const saveEditedNote = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingNote),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Failed to update note`;
        Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
        return;
      }

      Swal.fire({ title: 'Updated!', text: 'Note updated successfully.', icon: 'success' });
      closeEditModal();
      fetchNotes();
    } catch (err) {
      Swal.fire({ title: 'Error!', text: err.message, icon: 'error' });
    }
  };

  const openVersionModal = async (noteId) => {
    setLoadingVersions(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/notes/${noteId}/versions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Failed to fetch version history`;
        Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
        return;
      }

      const result = await response.json();
      setVersionHistory({ noteId, versions: result });
    } catch (err) {
      Swal.fire({ title: 'Error!', text: err.message, icon: 'error' });
    } finally {
      setLoadingVersions(false);
    }
  };

  const closeVersionModal = () => {
    setVersionHistory(null);
  };

  const handleRollbackVersion = async (noteId, versionIndex) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({ title: 'Unauthorized!', text: 'Please login again', icon: 'error' });
      return;
    }

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will restore the selected version and overwrite the current version!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, rollback',
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}/rollback`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ versionIndex }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Error rolling back version`;
        Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
        return;
      }

      Swal.fire({ title: 'Rolled Back!', text: 'Note version rolled back successfully.', icon: 'success' });
      fetchNotes();
      closeVersionModal();
    } catch (err) {
      Swal.fire({ title: 'Error!', text: err.message, icon: 'error' });
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Your Notes</h2>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by title, description, tags, or visibility"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-lg transition duration-300"
          >
            Search Notes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div key={note._id} className="bg-white p-4 rounded shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-green-700 mb-2">{note.title || 'Untitled Note'}</h3>
                    <button
                      onClick={() => openVersionModal(note._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      View Versions
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{note.description || 'No description'}</p>
                {note.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center mt-2">
                  <span className={`font-medium ${note.visibility === 'public' ? 'text-green-600' : 'text-red-600'}`}>
                    {note.visibility || 'unknown'}
                  </span>
                  <div className="space-x-2">
                    <button onClick={() => openEditModal(note)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-1 rounded text-sm">Edit</button>
                    <button onClick={() => handleDelete(note._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              {notes.length === 0 ? 'You don\'t have any notes yet.' : 'No notes found.'}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingNote && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Edit Note</h3>
            <input
              type="text"
              className="w-full mb-2 p-2 border rounded"
              value={editingNote.title}
              onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              className="w-full mb-2 p-2 border rounded"
              rows={4}
              value={editingNote.description}
              onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
              placeholder="Description"
            />
            <select
              className="w-full mb-2 p-2 border rounded"
              value={editingNote.visibility}
              onChange={(e) => setEditingNote({ ...editingNote, visibility: e.target.value })}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            <button onClick={saveEditedNote} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2">Save</button>
            <button onClick={closeEditModal} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>,
        document.body
      )}

      {/* Version History Modal */}
      {versionHistory && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <h3 className="text-2xl font-semibold mb-4">Version History</h3>
            {loadingVersions ? (
              <p>Loading versions...</p>
            ) : versionHistory.versions.length === 0 ? (
              <p>No versions available.</p>
            ) : (
              versionHistory.versions.map((v, idx) => (
                <div key={idx} className="mb-4 p-3 border rounded">
                  <p className="font-bold text-green-700">{v.title || 'No Title'}</p>
                  <p className="text-gray-700 mb-2">{v.description || 'No Description'}</p>
                  <button
                    onClick={() => handleRollbackVersion(versionHistory.noteId, idx)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Rollback to this version
                  </button>
                </div>
              ))
            )}
            <button onClick={closeVersionModal} className="mt-4 bg-gray-300 px-4 py-2 rounded">Close</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Notes;
