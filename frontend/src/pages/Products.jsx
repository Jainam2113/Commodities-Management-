import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Plus, Search, Filter, Download, Edit, Trash2, Eye } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const Products = () => {
    const { state, actions } = useApp()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('published')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProducts, setSelectedProducts] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)

    useEffect(() => {
        actions.fetchProducts({ status: activeTab, search: searchTerm })
    }, [activeTab, searchTerm])

    const handleSearch = (e) => {
        e.preventDefault()
        actions.fetchProducts({ status: activeTab, search: searchTerm })
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setSelectedProducts([])
    }

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const handleSelectAll = () => {
        if (selectedProducts.length === state.products.items.length) {
            setSelectedProducts([])
        } else {
            setSelectedProducts(state.products.items.map(p => p.id))
        }
    }

    const handleDeleteProduct = async (product) => {
        setProductToDelete(product)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        if (!productToDelete) return

        try {
            await actions.deleteProduct(productToDelete.id)
            toast.success('Product deleted successfully!')
            setShowDeleteModal(false)
            setProductToDelete(null)
        } catch (error) {
            toast.error('Failed to delete product')
        }
    }

    const handleEditProduct = (product) => {
        navigate(`/products/edit/${product.id}`)
    }

    const handleViewProduct = (product) => {
        // For now, just show product details in a toast
        toast.success(`Viewing ${product.name}`)
    }

    const { items: products, loading, pagination } = state.products

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-responsive-xl font-bold text-gray-900 dark:text-white">
                        Products
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage your product inventory
                    </p>
                </div>

                <Link
                    to="/products/add"
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="card">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8 px-6 py-3">
                        <button
                            onClick={() => handleTabChange('published')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'published'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            Published ({products.filter(p => p.status === 'published').length})
                        </button>
                        <button
                            onClick={() => handleTabChange('draft')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'draft'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            Draft ({products.filter(p => p.status === 'draft').length})
                        </button>
                    </nav>
                </div>

                {/* Controls */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <form onSubmit={handleSearch} className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-field pl-10"
                                />
                            </div>
                        </form>

                        <div className="flex items-center space-x-3">
                            <button className="btn-secondary flex items-center space-x-2">
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </button>
                            <button className="btn-secondary flex items-center space-x-2">
                                <Download className="w-4 h-4" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                {loading ? (
                    <div className="p-8">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {searchTerm ? 'Try adjusting your search criteria' : `No ${activeTab} products yet`}
                        </p>
                        <Link to="/products/add" className="btn-primary">
                            Add Your First Product
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.length === products.length && products.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Views
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => handleSelectProduct(product.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 text-xs">IMG</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {product.description ? product.description.substring(0, 50) + '...' : 'No description'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {product.category || 'Uncategorized'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ${product.price}
                                            {product.discount > 0 && (
                                                <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                            -{product.discount}%
                          </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {product.views?.toLocaleString() || 0}
                                    </td>
                                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'published'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {product.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleViewProduct(product)}
                                                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                title="View details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                title="Edit product"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product)}
                                                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                title="Delete product"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {products.length > 0 && (
                    <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {products.length} of {pagination.total} products
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                    1
                                </button>
                                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                                    2
                                </button>
                                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                                    3
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Delete Product
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Products
