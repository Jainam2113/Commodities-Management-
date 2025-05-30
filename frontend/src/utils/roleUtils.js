export const ROLES = {
    manager: 'manager',
    store_keeper: 'store_keeper'
}

export const hasRole = (userRole, requiredRoles) => {
    if (!userRole || !requiredRoles) return false
    if (Array.isArray(requiredRoles)) {
        return requiredRoles.includes(userRole)
    }
    return userRole === requiredRoles
}

export const canAccessDashboard = (userRole) => {
    return hasRole(userRole, [ROLES.manager])
}

export const canManageProducts = (userRole) => {
    return hasRole(userRole, [ROLES.manager, ROLES.store_keeper])
}

export const getMenuItems = (userRole) => {
    const baseItems = [
        {
            name: 'Products',
            path: '/products',
            icon: 'Package',
            roles: [ROLES.manager, ROLES.store_keeper]
        }
    ]

    const managerItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'LayoutDashboard',
            roles: [ROLES.manager]
        }
    ]

    const allItems = [...managerItems, ...baseItems]

    return allItems.filter(item => hasRole(userRole, item.roles))
}