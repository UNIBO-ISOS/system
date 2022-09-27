enum roles {
    admin = 'admin',
    restaurant = 'restaurant',
    courier = 'courier',
    normal = 'normal'
}

const getAllRoles = () => {
    return [roles.courier, roles.normal, roles.restaurant, roles.admin]
}

export { roles, getAllRoles }