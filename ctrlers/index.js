// @brief: base ctrler

var Ctrler = function(model) {
    this.model = model ? model : null;
};

Ctrler.prototype.checkId = function(id) {
    return (id && id.match(/^[0-9a-fA-F]{24}$/));
};

Ctrler.prototype.create = function(baby, callback) {
    if (!this.model) return callback(new Error('model required'));
    return this.model.create(baby, callback);
};

Ctrler.prototype.find = function(query, callback) {
    if (!this.model) return callback(new Error('model required'));
    if (query && callback) return this.model.find(query).exec(callback);
    if (query && !callback) return this.model.find(query);
    return false;
};

Ctrler.prototype.findOne = function(query, callback) {
    if (!this.model) return callback(new Error('model required'));
    if (query && callback) return this.model.findOne(query).exec(callback);
    if (query && !callback) return this.model.findOne(query);
};

Ctrler.prototype.findById = function(id, callback) {
    if (!this.model) return callback(new Error('model required'));
    if (!this.checkId(id)) return callback(new Error('id required'));
    if (id && callback) return this.model.findById(id).exec(callback);
    if (id && !callback) return this.model.findById(id);
};

Ctrler.prototype.update = function(id, update, callback) {
    if (!this.model) return callback(new Error('model required'));
    if (!this.checkId(id)) return callback(new Error('id required'));
    return this.model.findByIdAndUpdate(id, update, callback);
};

Ctrler.prototype.updates = function(query, update, callback) {
    if (!this.model) return callback(new Error('model required'));
    return this.model.update(query, update, callback);
};

Ctrler.prototype.updateOne = function(query, update, callback) {
    if (!this.model) return callback(new Error('model required'));
    return this.model.findOneAndUpdate(query, update, callback);
};

Ctrler.prototype.remove = function(id, callback) {
    if (!this.model) return callback(new Error('model required'));
    if (!this.checkId(id)) return callback(new Error('id required'));
    return this.model.findByIdAndRemove(id, callback);
};

Ctrler.prototype.removes = function(query, callback) {
    if (!this.model) return callback(new Error('model required'));
    return this.model.remove(query, callback);
};

Ctrler.prototype.removeOne = function(query, callback) {
    if (!this.model) return callback(new Error('model required'));
    return this.model.findOneAndRemove(query, callback);
};

Ctrler.prototype.populate = function(doc, params, callback) {
    if (!this.model) return callback(new Error('model required'));
    this.model.populate(doc, params, callback);
};

Ctrler.prototype.count = function(params, callback) {
    if (!this.model) return callback(new Error('model required'));
    var cb = (!callback && typeof(params) === 'function') ? params : callback,
        query = (params && typeof(params) === 'object') ? params : {};
    return this.model.count(query, cb);
};

Ctrler.prototype.list = function(params, callback) {
    if (!this.model) return callback(new Error('model required'));
    var cb = (!callback && typeof(params) === 'function') ? params : callback,
        query = (params && typeof(params) === 'object') ? params : {},
        cursor = this.model.find(query);
    if (cb) return cursor.exec(cb);
    if (typeof(params) !== 'function' && !callback) return cursor;
};

Ctrler.prototype.page = function(page, limit, params, callback) {
    if (!this.model) return callback(new Error('model required'));
    var self = this,
        from = (page && page > 1) ? ((page - 1) * limit) : 0,
        mainCursor = self.model.find(params).skip(from).limit(limit),
        countCursor = self.model.count(params),
        pager = { limit: limit, current: page ? page : 1 };
    var ret = {
        query: mainCursor,
        count: countCursor,
        pager: pager
    };
    if (!(callback && typeof(callback) === 'function')) return ret;
    return countCursor.exec(function(err, count) {
        if (err) return callback(err);
        pager.max = Math.round(count / limit);
        mainCursor.exec(function(err, results) {
            callback(err, results, pager);
        });
    });
};

module.exports = Ctrler;
