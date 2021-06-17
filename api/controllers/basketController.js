const { BasketDevice, Basket, User } = require('../models/models');
const ApiError = require('../error/ApiError');


class BasketController {
    async getAll(req, res) {
        const all_basket = await Basket.findAndCountAll({})
        const all_basket_device = await BasketDevice.findAndCountAll({})
        const result = { basket: { ...all_basket }, device: { ...all_basket_device } }
        // return res.json(result)
        // console.log('result :>> ', all_basket);
        // console.log('result device:>> ', all_basket_device);
        res.json(result)
    }
    async getOne(req, res) {
        const { email } = req.params
        const { id: userId } = await User.findOne({ where: { email } })
        const { id: basketId } = await Basket.findOne({ where: { userId, isComplete: false }, })
        const devices = await BasketDevice.findAll({ where: { basketId } })

        res.json(devices)
    }
    async create(req, res, next) {
        try {
            let { userId, deviceId, count = 1 } = req.body
            const { id: basketId } = await Basket.create({ userId })
            const result = await BasketDevice.create({ basketId, deviceId, count })
            return res.json(result)
        } catch (error) {
            console.log(`error`, error)
            next(ApiError.badRequest(error.message))
        }
    }
    async update(req, res, next) {
        const { basketDeviceId: id, deviceId, count } = req.body
        const basket_device = await BasketDevice.findOne({ where: { id } })
        basket_device.deviceId = deviceId
        basket_device.count = count
        const updateData = await basket_device.save()
        // .then(data => data).catch(error => console.log(error))
        res.json(updateData)
    }
    async delete(req, res, next) {
        let { id } = req.params
        try {
            const destroy = await Basket.destroy({ where: { id } }).then(() => {
                res.status(200).json('DELETE')
            })
        } catch (error) {
            next(ApiError.badRequest(`Object ${id} hasn\'t deleted`))
        }
    }
}

module.exports = new BasketController()