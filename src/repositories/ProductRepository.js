const { Op } = require('sequelize')
const { DbContext } = require('../dbcontext/sequelize')
const Category = require('../entities/Category')

module.exports = {
	getAll: async () => await DbContext.Product.findAll({ include: 'Category' }),

	getById: async (id) => await DbContext.Product.findByPk(id, { include: 'Category' }),

	getTop10Newest: async () => {
		const valorants = await DbContext.Product.findAll({
			include: [
				{
					model: DbContext.Category,
					as: 'Category',
					where: {
						name: 'valorant',
					},
				},
			],
			order: [['id', 'DESC']],
			limit: 0,
		})
		const phasmo = await DbContext.Product.findAll({
			include: [
				{
					model: DbContext.Category,
					as: 'Category',
					where: {
						name: 'phasmo',
					},
				},
			],
			order: [['id', 'DESC']],
			limit: 5,
		})
		return [...valorants, ...phasmo]
	},

	filterByCategory: async (categoryName) =>
		await DbContext.Product.findAll({
			include: [
				{
					model: DbContext.Category,
					as: 'Category',
					where: { name: categoryName },
				},
			],
		}),

	filterByNameContained: async (name) =>
		await DbContext.Product.findAll({
			where: {
				name: { [Op.like]: `%${name}%` },
			},
		}),

	filterByCategoryAndName: async (categoryName, name) =>
		await DbContext.Product.findAll({
			include: [
				{
					model: DbContext.Category,
					as: 'Category',
					where: { name: categoryName },
				},
			],
			where: {
				name: { [Op.like]: `%${name}%` },
			},
		}),

	add: async (product) => await DbContext.Product.create({ ...product }),

	update: async (product, newValue) => {
		product.set({ ...newValue })
		await product.save()
	},

	delete: async (product) => await product.destroy(),
}
