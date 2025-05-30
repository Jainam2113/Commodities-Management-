import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import ProductCard from './ProductCard'
import LoadingSpinner from '../common/LoadingSpinner'

const ProductList = ({
                         products = [],
                         loading = false,
                         onSearch,
                         onFilter,
                         onEdit,
                         onDelete,
                         onView,
                         onAddNew
                     }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const categories = [
        'All Categories',
        'Electronics',
        'Fashion',
        'Home & Garden',
        'Sports & Outdoors',
        'Books & Media',
        'Health & Beauty'
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        onSearch && onSearch(searchTerm)
    }

    const handleCategoryChange = (category) => {
        setSelectedCategory(category)
        onFilter && onFilter({ category: category === 'All Categories' ? '' : category })
    }

    if (loading) {
        return <LoadingSpinner size="lg" />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Products ({products.length})
                </h2>

                {onAddNew && (
                    <button
                        onClick={onAddNew}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
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

                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="input-field min-w-40"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No products found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Try adjusting your search or filter criteria
                    </p>
                    {onAddNew && (
                        <button
                            onClick={onAddNew}
                            className="btn-primary"
                        >
                            Add your first product
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onView={onView}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductList
