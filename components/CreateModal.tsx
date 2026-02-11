
import React, { useState, useRef } from 'react';
import { api } from '../src/services/api';
import { useTranslations } from '../src/i18n';

interface CreateModalProps {
  onClose: () => void;
  onContentCreated?: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose, onContentCreated }) => {
  const [activeTab, setActiveTab] = useState('select');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [cover, setCover] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // File upload states
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const i18n = useTranslations();

  const options = [
    { icon: 'edit_note', label: i18n.createModal.content, desc: i18n.createModal.contentDesc, value: 'content' },
    { icon: 'live_tv', label: i18n.createModal.live, desc: i18n.createModal.liveDesc, highlight: true, value: 'live' },
    { icon: 'school', label: i18n.createModal.course, desc: i18n.createModal.courseDesc, value: 'course' },
    { icon: 'groups', label: i18n.createModal.group, desc: i18n.createModal.groupDesc, value: 'group' },
  ];

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files) as File[];
      processFiles(selectedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files) as File[];
      processFiles(droppedFiles);
    }
  };

  const processFiles = (selectedFiles: File[]) => {
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const fileType = file.type;
      const fileSize = file.size;
      const maxSize = 50 * 1024 * 1024; // 50MB max
      
      if (fileSize > maxSize) {
        setUploadError(`文件 ${file.name} 超过了 50MB 的大小限制`);
        return false;
      }
      
      if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
        setUploadError(`文件 ${file.name} 不是支持的图片或视频格式`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) {
      return;
    }

    // Generate previews for valid files
    const previews = validFiles.map(file => URL.createObjectURL(file));
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    setFilePreviews(prevPreviews => [...prevPreviews, ...previews]);
    setUploadError('');
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setFilePreviews(prevPreviews => {
      const newPreviews = prevPreviews.filter((_, i) => i !== index);
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prevPreviews[index]);
      return newPreviews;
    });
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      return;
    }

    setUploadProgress(0);
    setUploadError('');
    setUploadSuccess('');

    try {
      // Simulate file upload with progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 300);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      setUploadSuccess('文件上传成功！');
      // For now, we'll just use the first file as the cover
      if (files.length > 0) {
        setCover(filePreviews[0]);
      }
    } catch (err) {
      setUploadError('文件上传失败，请重试');
      console.error('Upload error:', err);
    } finally {
      setUploadProgress(0);
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.createContent({
        title,
        description,
        category,
        cover
      });
      setSuccess('作品发布成功！');
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setCover('');
      // Clear files and previews
      files.forEach(file => URL.revokeObjectURL(filePreviews[files.indexOf(file)]));
      setFiles([]);
      setFilePreviews([]);
      // Notify parent component that content was created
      if (onContentCreated) {
        onContentCreated();
      }
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('发布失败，请重试');
      console.error('Create content error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bgDark/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl shadow-primary/20 border border-primary/10 overflow-hidden animate-in fade-in zoom-in duration-500 transform transition-all hover:shadow-3xl hover:shadow-primary/30">
        <div className="p-8 border-b border-primary/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {activeTab === 'select' ? i18n.createModal.title : 
               activeTab === 'content' ? i18n.createModal.content : 
               activeTab === 'live' ? i18n.createModal.live : 
               activeTab === 'course' ? i18n.createModal.course : i18n.createModal.group}
            </h2>
            <p className="text-slate-500 text-sm">
              {activeTab === 'select' ? i18n.createModal.selectOption : 
               activeTab === 'content' ? i18n.createModal.contentDesc : 
               activeTab === 'live' ? i18n.createModal.liveDesc : 
               activeTab === 'course' ? i18n.createModal.courseDesc : i18n.createModal.groupDesc}
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-primary/5 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        {/* Selection Tab */}
        {activeTab === 'select' && (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(opt.value)}
                className={`p-6 rounded-[2rem] border transition-all duration-300 text-left flex gap-6 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
                  opt.highlight
                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40'
                    : 'bg-slate-50 dark:bg-zinc-800/50 border-primary/5 hover:border-primary/20 hover:bg-slate-100 dark:hover:bg-zinc-700/50'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-300 transform hover:scale-105 ${
                  opt.highlight ? 'bg-white/20' : 'bg-white dark:bg-zinc-800 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-3xl transition-all duration-300 transform hover:scale-110">{opt.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg mb-1 transition-all duration-300">{opt.label}</p>
                  <p className={`text-xs ${opt.highlight ? 'text-white/70' : 'text-slate-400'} transition-all duration-300`}>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Content Creation Tab */}
        {activeTab === 'content' && (
          <form onSubmit={handleCreateContent} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{i18n.createModal.contentTitle}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300 hover:border-primary/30"
                placeholder={i18n.createModal.titlePlaceholder}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{i18n.createModal.description}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300 hover:border-primary/30 resize-none"
                placeholder={i18n.createModal.descriptionPlaceholder}
                rows={3}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{i18n.createModal.category}</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300 hover:border-primary/30"
                placeholder={i18n.createModal.categoryPlaceholder}
              />
            </div>

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{i18n.createModal.uploadFiles}</label>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-zinc-700 hover:border-primary/50'}`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">cloud_upload</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  {i18n.createModal.dragDrop}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {i18n.createModal.fileTypes}
                </p>
              </div>
              
              {/* File Previews */}
              {filePreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{i18n.createModal.selectedFiles}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {filePreviews.map((preview, index) => {
                      const file = files[index];
                      const isVideo = file.type.startsWith('video/');
                      
                      return (
                        <div key={index} className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-700">
                            {isVideo ? (
                              <video 
                                src={preview} 
                                className="w-full h-full object-cover"
                                controls
                                muted
                                loop
                              />
                            ) : (
                              <img 
                                src={preview} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Upload Progress */}
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>{i18n.createModal.uploadProgress}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Upload Button */}
              {files.length > 0 && uploadProgress === 0 && (
                <button
                  type="button"
                  onClick={handleUploadFiles}
                  className="mt-4 w-full py-3 bg-primary text-white rounded-lg font-bold hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  {i18n.createModal.startUpload}
                </button>
              )}
              
              {/* Upload Messages */}
              {uploadError && (
                <div className="mt-4 text-red-500 text-sm">{uploadError}</div>
              )}
              
              {uploadSuccess && (
                <div className="mt-4 text-green-500 text-sm">{uploadSuccess}</div>
              )}
            </div>
            
            {/* Cover Image URL (fallback) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{i18n.createModal.coverImage}</label>
              <input
                type="text"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300 hover:border-primary/30"
                placeholder={i18n.createModal.coverImagePlaceholder}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {success && (
              <div className="text-green-500 text-sm">{success}</div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('select')}
                className="flex-1 py-3 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-zinc-700"
              >
                {i18n.common.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>发布中...</span>
                  </>
                ) : (
                  <>
                    <span>{i18n.createModal.publish}</span>
                    <span className="material-symbols-outlined text-base">send</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Other tabs (placeholder) */}
        {(activeTab === 'live' || activeTab === 'course' || activeTab === 'group') && (
          <div className="p-8 flex flex-col items-center justify-center h-64">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">construction</span>
            <h3 className="text-xl font-bold mb-2">{i18n.createModal.construction}</h3>
            <p className="text-slate-500 text-center mb-6">{i18n.createModal.constructionDesc}</p>
            <button
              onClick={() => setActiveTab('select')}
              className="px-6 py-3 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
            >
              {i18n.createModal.backToSelect}
            </button>
          </div>
        )}

        <div className="p-8 bg-slate-50 dark:bg-zinc-800/50 flex justify-center">
          <p className="text-xs text-slate-400 font-medium">{i18n.createModal.creatorRights}</p>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
