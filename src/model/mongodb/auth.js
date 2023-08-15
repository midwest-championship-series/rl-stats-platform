const { Schema } = require('mongoose')
const { createModel } = require('../../services/mongodb')

const schema = {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    player_id: { type: Schema.Types.ObjectId }
}

const Model = createModel('Auth', schema, (schema) => {
    schema.pre('save', function () {
        this.email = this.email.toLowerCase()
    })
    schema.virtual('player', {
        ref: 'Player',
        localField: 'player_id',
        foreignField: '_id',
        justOne: true
    })
})

module.exports = { Model }
