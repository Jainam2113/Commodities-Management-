import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const ProductForm = ({
                         product = null,
                         onSubmit,
                         onCancel,
                         loading = false
                     }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        tags: '',
        price: '',
        discount: '',
        discountCategory: '',
        status: 'published',
        imageUrl: '',
        thumbnailUrl: ''
    })

    const [previewImage, setPreviewImage] = useState(null)
    const [thumbnailImage, setThumbnailImage] = useState(null)
    const [errors, setErrors] = useState({})

    const categories = [
        'Electronics',
        'Fashion',
        'Home & Garden',
        'Sports & Outdoors',
        'Books & Media',
        'Health & Beauty',
        'Automotive',
        'Food & Beverages',
        'Office Supplies',
        'Toys & Games',
        'Other'
    ]

    const discountCategories = [
        'clearance',
        'seasonal',
        'bulk',
        'loyalty',
        'flash-sale',
        'member-exclusive'
    ]

    // Initialize form with product data if editing
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                category: product.category || '',
                description: product.description || '',
                tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
                price: product.price || '',
                discount: product.discount || '',
                discountCategory: product.discountCategory || '',
                status: product.status || 'published',
                imageUrl: product.imageUrl || '',
                thumbnailUrl: product.thumbnailUrl || ''
            })

            if (product.imageUrl) {
                setPreviewImage({ preview: product.imageUrl })
            }
            if (product.thumbnailUrl) {
                setThumbnailImage({ preview: product.thumbnailUrl })
            }
        }
    }, [product])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required'
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required'
        }

        if (formData.discount && (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
            newErrors.discount = 'Discount must be between 0 and 100'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Image size must be less than 5MB')
                return
            }

            const reader = new FileReader()
            reader.onload = (event) => {
                if (type === 'preview') {
                    setPreviewImage({
                        file,
                        preview: event.target.result,
                        name: file.name
                    })
                    setFormData(prev => ({ ...prev, imageUrl: event.target.result }))
                } else {
                    setThumbnailImage({
                        file,
                        preview: event.target.result,
                        name: file.name
                    })
                    setFormData(prev => ({ ...prev, thumbnailUrl: event.target.result }))
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = (type) => {
        if (type === 'preview') {
            setPreviewImage(null)
            setFormData(prev => ({ ...prev, imageUrl: '' }))
        } else {
            setThumbnailImage(null)
            setFormData(prev => ({ ...prev, thumbnailUrl: '' }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fix the errors below')
            return
        }

        const processedData = {
            ...formData,
            price: parseFloat(formData.price),
            discount: formData.discount ? parseFloat(formData.discount) : 0,
            tags: formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                : []
        }

        onSubmit && onSubmit(processedData)
    }

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="card p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {product ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Product Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Category
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="published">Published</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter product description"
                                        rows={4}
                                        className="input-field resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="Enter tags separated by commas"
                                        className="input-field"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Separate tags with commas
                                    </p>
                                </div>

                                {/* Pricing */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                                        Pricing
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Price *
                                            </label>
                                            <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          $
                        </span>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                    className={`input-field pl-8 ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                                                    required
                                                />
                                            </div>
                                            {errors.price && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Discount (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="discount"
                                                value={formData.discount}
                                                onChange={handleChange}
                                                placeholder="0"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                className={`input-field ${errors.discount ? 'border-red-500 focus:ring-red-500' : ''}`}
                                            />
                                            {errors.discount && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.discount}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Discount Category
                                            </label>
                                            <select
                                                name="discountCategory"
                                                value={formData.discountCategory}
                                                onChange={handleChange}
                                                className="input-field"
                                            >
                                                <option value="">Select type</option>
                                                {discountCategories.map(category => (
                                                    <option key={category} value={category}>
                                                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <div className="card p-6">
                            <div className="flex flex-col space-y-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                                </button>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="card p-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Product Images
                            </h4>

                            {/* Preview Image */}
                            <div className="mb-6">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Main Image
                                </h5>
                                {previewImage ? (
                                    <div className="relative">
                                        <img
                                            src={previewImage.preview}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage('preview')}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'preview')}
                                            className="hidden"
                                        />
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Click to upload
                                        </p>
                                    </label>
                                )}
                            </div>

                            {/* Thumbnail Image */}
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Thumbnail
                                </h5>
                                {thumbnailImage ? (
                                    <div className="relative">
                                        <img
                                            src={thumbnailImage.preview}
                                            alt="Thumbnail"
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage('thumbnail')}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'thumbnail')}
                                            className="hidden"
                                        />
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Click to upload
                                        </p>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Price Preview */}
                        {formData.price && (
                            <div className="card p-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Price Preview
                                </h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Final Price:</span>
                                    <div className="flex items-center space-x-2">
                                        {formData.discount > 0 && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ${parseFloat(formData.price).toFixed(2)}
                      </span>
                                        )}
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${(parseFloat(formData.price) * (1 - (parseFloat(formData.discount) || 0) / 100)).toFixed(2)}
                    </span>
                                        {formData.discount > 0 && (
                                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded-full">
                        -{formData.discount}%
                      </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ProductForm