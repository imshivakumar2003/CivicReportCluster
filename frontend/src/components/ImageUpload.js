import React, { useState } from 'react';

const ImageUpload = ({ images = [], onImagesChange }) => {
    const [preview, setPreview] = useState(images);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (preview.length + files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        setLoading(true);
        let uploadedCount = 0;

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                const newImages = [...preview, base64];
                setPreview(newImages);
                onImagesChange?.(newImages);

                uploadedCount++;
                if (uploadedCount === files.length) {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        const newImages = preview.filter((_, i) => i !== index);
        setPreview(newImages);
        onImagesChange?.(newImages);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
                📸 Attach Photos (Max 5)
            </label>

            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-xs text-gray-500">
                            {loading ? 'Uploading...' : 'Click to upload or drag'}
                        </p>
                    </div>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={loading || preview.length >= 5}
                        className="hidden"
                    />
                </label>
            </div>

            {preview.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {preview.map((img, idx) => (
                        <div key={idx} className="relative group">
                            <img
                                src={img}
                                alt={`preview-${idx}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-sm"
                            >
                                ✕
                            </button>
                            <p className="text-xs text-gray-500 mt-1">{idx + 1}/5</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
