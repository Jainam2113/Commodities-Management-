// frontend/src/pages/AddProduct.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { Upload, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const AddProduct = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [thumbnailImage, setThumbnailImage] = useState(null)

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

        setLoading(true)

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                tags: formData.tags
                    ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                    : []
            }

            await productService.createProduct(productData)
            toast.success('Product created successfully!')
            navigate('/products')
        } catch (error) {
            console.error('Error creating product:', error)
            const errorMessage = error.response?.data?.message || 'Failed to create product'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleDiscard = () => {
        if (window.confirm('Are you sure you want to discard changes? All unsaved data will be lost.')) {
            navigate('/products')
        }
    }

    const handleDraft = async () => {
        const draftData = { ...formData, status: 'draft' }
        setFormData(draftData)

        // Trigger form submission with draft status
        const form = document.getElementById('product-form')
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Product</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Create a new product for your inventory
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate('/products')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form id="product-form" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Product Information Card */}
                            <div className="card p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Add New Product
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            Fill in the details below to create your product
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleDiscard}
                                            className="px-6 py-2 border border-red-300 text-red-700 dark:text-red-400 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            Discard Change
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDraft}
                                            disabled={loading}
                                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Save as Draft
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8"
                                        >
                                            {loading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Saving...</span>
                                                </div>
                                            ) : (
                                                'Save Product'
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* General Information */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                                            General Information
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
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

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Product Category
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

                                            <div className="md:col-span-2">
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

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Tag Keywords
                                                </label>
                                                <textarea
                                                    name="tags"
                                                    value={formData.tags}
                                                    onChange={handleChange}
                                                    placeholder="Enter tags separated by commas (e.g., electronics, smartphone, mobile)"
                                                    rows={3}
                                                    className="input-field resize-none"
                                                />
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    Separate tags with commas to help customers find your product
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Section */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                                            Pricing
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                                    <option value="">Select discount type</option>
                                                    {discountCategories.map(category => (
                                                        <option key={category} value={category}>
                                                            {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Price Preview */}
                                        {formData.price && (
                                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Price Preview:
                          </span>
                                                    <div className="flex items-center space-x-2">
                                                        {formData.discount > 0 && (
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                ${parseFloat(formData.price).toFixed(2)}
                              </span>
                                                        )}
                                                        <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
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
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Preview Product Image */}
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Preview Product
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Upload your main product image
                                </p>

                                <div className="space-y-4">
                                    {previewImage ? (
                                        <div className="relative">
                                            <img
                                                src={previewImage.preview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage('preview')}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {previewImage.name}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'preview')}
                                                className="hidden"
                                            />
                                            <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                                                Drag and drop here
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                or click to browse
                                            </p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail Product Image */}
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Thumbnail Product
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Upload a thumbnail for listings
                                </p>

                                <div className="space-y-4">
                                    {thumbnailImage ? (
                                        <div className="relative">
                                            <img
                                                src={thumbnailImage.preview}
                                                alt="Thumbnail"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage('thumbnail')}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {thumbnailImage.name}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'thumbnail')}
                                                className="hidden"
                                            />
                                            <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                                                Drag and drop here
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                or click to browse
                                            </p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Product Summary */}
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Product Summary
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            formData.status === 'published'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                        }`}>
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Category:</span>
                                        <span className="text-gray-900 dark:text-white">
                      {formData.category || 'Not selected'}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Price:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                      {formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : '$0.00'}
                    </span>
                                    </div>
                                    {formData.discount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                                            <span className="text-red-600 dark:text-red-400">
                        -{formData.discount}%
                      </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProduct