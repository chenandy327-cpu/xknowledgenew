
import React, { useState, useRef } from 'react';
import { api } from '@api';

interface CreateModalProps {
  onClose: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose }) => {
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

  const options = [
    { icon: 'edit_note', label: '发布作品', desc: '支持图文、视频多媒体', value: 'content' },
    { icon: 'live_tv', label: '发起直播', desc: '连接课程，实时互动', highlight: true, value: 'live' },
    { icon: 'school', label: '上传录播', desc: '系统化课程教学', value: 'course' },
    { icon: 'groups', label: '创建小组', desc: '连接志同道合的伙伴', value: 'group' },
  ];

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
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
      const droppedFiles = Array.from(e.dataTransfer.files);
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
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-primary/10 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-primary/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {activeTab === 'select' ? '开始创作' : 
               activeTab === 'content' ? '发布作品' : 
               activeTab === 'live' ? '发起直播' : 
               activeTab === 'course' ? '上传录播' : '创建小组'}
            </h2>
            <p className="text-slate-500 text-sm">
              {activeTab === 'select' ? '选择你的创作形式，激发无限潜能' : 
               activeTab === 'content' ? '分享你的知识和创意' : 
               activeTab === 'live' ? '与大家实时互动' : 
               activeTab === 'course' ? '创建系统化的课程' : '连接志同道合的伙伴'}
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
                className={`p-6 rounded-[2rem] border transition-all text-left flex gap-6 hover:-translate-y-1 ${
                  opt.highlight
                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30'
                    : 'bg-slate-50 dark:bg-zinc-800/50 border-primary/5 hover:border-primary/20'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                  opt.highlight ? 'bg-white/20' : 'bg-white dark:bg-zinc-800 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-3xl">{opt.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg mb-1">{opt.label}</p>
                  <p className={`text-xs ${opt.highlight ? 'text-white/70' : 'text-slate-400'}`}>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Content Creation Tab */}
        {activeTab === 'content' && (
          <form onSubmit={handleCreateContent} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="输入作品标题"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="输入作品描述"
                rows={3}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">分类</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="输入作品分类"
              />
            </div>

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">上传媒体文件</label>
              
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
                  点击或拖放文件到此处上传
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  支持图片和视频文件，单个文件不超过 50MB
                </p>
              </div>
              
              {/* File Previews */}
              {filePreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">已选择的文件</h4>
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
                    <span>上传进度</span>
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
                  开始上传文件
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">封面图片 URL (可选)</label>
              <input
                type="text"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="输入封面图片 URL (如果不上传文件)"
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
                className="flex-1 py-3 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? '发布中...' : '发布作品'} <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </form>
        )}

        {/* Other tabs (placeholder) */}
        {(activeTab === 'live' || activeTab === 'course' || activeTab === 'group') && (
          <div className="p-8 flex flex-col items-center justify-center h-64">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">construction</span>
            <h3 className="text-xl font-bold mb-2">功能开发中</h3>
            <p className="text-slate-500 text-center mb-6">该功能正在开发中，敬请期待</p>
            <button
              onClick={() => setActiveTab('select')}
              className="px-6 py-3 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
            >
              返回选择
            </button>
          </div>
        )}

        <div className="p-8 bg-slate-50 dark:bg-zinc-800/50 flex justify-center">
          <p className="text-xs text-slate-400 font-medium">x² 创作者权益：全方位多媒体形态支持（图文/视频/直播）</p>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
