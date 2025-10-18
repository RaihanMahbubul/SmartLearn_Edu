import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { supabase } from '../services/supabase.ts';
import Spinner from '../components/Spinner.tsx';

const ProfilePage: React.FC = () => {
  const { user, setAuthModalOpen, setAuthModalMessage } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata.displayName || '');
      setPhotoPreview(user.user_metadata.photoURL);
    }
  }, [user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handleNameUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoadingName(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ 
        data: { displayName } 
      });
      if (error) throw error;
      setMessage({ text: 'Display name updated successfully!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoadingName(false);
    }
  };

  const handlePhotoUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !photoFile) return;
    setLoadingPhoto(true);
    setMessage(null);
    try {
      // Use user ID and a timestamp to create a unique file path
      const filePath = `avatars/${user.id}/${Date.now()}-${photoFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars') // Assumes a public bucket named 'avatars'
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrl) {
          throw new Error("Could not get public URL for the uploaded file.");
      }

      const { error: updateUserError } = await supabase.auth.updateUser({
        data: { photoURL: publicUrl }
      });

      if (updateUserError) throw updateUserError;

      setMessage({ text: 'Avatar updated successfully!', type: 'success' });
      setPhotoFile(null); // Clear file after upload
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoadingPhoto(false);
    }
  };

  if (!user) {
    return (
       <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">My Profile</h1>
        <p className="text-gray-300 mb-6">Please log in to view your profile.</p>
        <button 
          onClick={() => {
            setAuthModalMessage(`Log in to view your profile.`);
            setAuthModalOpen(true);
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Login or Sign Up
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        My Profile
      </h1>
      <div className="max-w-4xl mx-auto bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-700">
        {message && (
          <div className={`p-4 mb-6 rounded-md text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {message.text}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={photoPreview || `https://api.dicebear.com/8.x/initials/svg?seed=${user.email}`} 
              alt="Avatar" 
              className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500"
            />
             <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
             <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300">
                Choose Image
             </label>
            {photoFile && (
              <form onSubmit={handlePhotoUpdate} className="w-full">
                <button type="submit" disabled={loadingPhoto} className="w-full flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50">
                  {loadingPhoto ? <Spinner /> : 'Upload Avatar'}
                </button>
              </form>
            )}
          </div>
          
          {/* Info Section */}
          <div className="md:col-span-2">
            <form onSubmit={handleNameUpdate} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={user.email || ''}
                  disabled 
                  className="w-full bg-gray-700/50 border-gray-600 rounded-md shadow-sm text-gray-400 p-3 cursor-not-allowed" 
                />
              </div>
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                <input 
                  type="text" 
                  id="displayName" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How you'd like to be called"
                  className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-3" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loadingName}
                className="w-full flex justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {loadingName ? <Spinner /> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;