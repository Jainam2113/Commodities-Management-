import { Edit, Trash2, Eye } from 'lucide-react'

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
    const {
        id,
        name,
        category,
        price,
        views = 0,
        revenue = 0,
        imageUrl,
        thumbnailUrl,
        status,
        discount = 0
    } = product

    const finalPrice = price * (1 - discount / 100)

    return (
        <div className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    {imageUrl || thumbnailUrl ? (
                        <img
                            src={imageUrl || thumbnailUrl}
                            alt={name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <span className="text-gray-400 text-xs">IMG</span>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {category}
                            </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                            <button
                                onClick={() => onView && onView(product)}
                                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="View details"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onEdit && onEdit(product)}
                                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="Edit product"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete && onDelete(product)}
                                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                title="Delete product"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-4">
              <span className="text-gray-500 dark:text-gray-400">
                {views.toLocaleString()} views
              </span>
                            <div className="flex items-center space-x-2">
                                {discount > 0 && (
                                    <span className="text-gray-400 line-through">
                    ${price.toFixed(2)}
                  </span>
                                )}
                                <span className="font-medium text-gray-900 dark:text-white">
                  ${finalPrice.toFixed(2)}
                </span>
                                {discount > 0 && (
                                    <span className="px-1 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded">
                    -{discount}%
                  </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Revenue: ${revenue.toLocaleString()}
            </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            status === 'published'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
              {status}
            </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard