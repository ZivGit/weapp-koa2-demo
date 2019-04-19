const configs = require('../config')
const { mysql } = require('../qcloud')
const moment = require('moment')


async function post(ctx, next) {
    const { images, imgType, thumbnail, title, content } = ctx.request.body

    const object = {
        post_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        post_images: images,
        post_imagesCount: JSON.parse(images).length,
        post_imagesType: imgType,
        post_thumbnail: thumbnail,
        post_title: title,
        post_author: 'test_author',
        post_content: content,
    }

    await mysql('evidence')
        .returning('id')
        .insert(object)
        .timeout(configs.timeout)
        .then(res => {
            ctx.state.code = 0
            ctx.state.data = {
                id: res[0]
            }
        })
        .catch(err => {
            ctx.state.code = -1
            throw new Error(err)
        })
}


async function get(ctx, next) {
    const { id } = ctx.params
    const { selected } = ctx.query

    const object = {
        where: {id: id},
        select: (selected ? JSON.parse(selected) : '*'),
    }

    if (id) {
        await mysql('evidence')
            .where(object.where)
            .select(object.select)
            .timeout(configs.timeout)
            .then(res => {
                ctx.state.code = 0
                ctx.state.data = res
            })
            .catch(err => {
                ctx.state.code = -1
                throw new Error(err)
            })
    } else {
        await mysql('evidence')
            .select(object.select)
            .timeout(configs.timeout)
            .then(res => {
                ctx.state.code = 0
                ctx.state.data = res
            })
            .catch(err => {
                ctx.state.code = -1
                throw new Error(err)
            })
    }
}


async function put(ctx, next) {
    const { id } = ctx.params
    const { visits } = ctx.request.body

    const object = {
        where: ['id', '=', id],
        increment: ['visitor_count', visits],
    }

    if (id) {
        await mysql('evidence')
            .where(...object.where)
            .increment(...object.increment)
            .timeout(configs.timeout)
            .then(res => {
                ctx.state.code = 0
                ctx.state.data = res
            })
            .catch(err => {
                ctx.state.code = -1
                throw new Error(err)
            })
    }
}


module.exports = {
    post,
    get,
    put,
}