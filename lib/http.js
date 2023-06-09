const {URL} = require('url')

const centra = require('centra')

const httpjs = async (opts) => {
	if (typeof(opts) !== 'string') {
		if (!opts.hasOwnProperty('url')) {
			throw new Error('Missing url option from options for request method.')
		}
	}

	const req = centra(typeof opts === 'object' ? opts.url : opts, opts.method || 'GET')

	if (opts.headers) req.header(opts.headers)
	if (opts.stream) req.stream()
	if (opts.timeout) req.timeout(opts.timeout)
	if (opts.data) req.body(opts.data)
	if (opts.form) req.body(opts.form, 'form')
	if (opts.compression) req.compress()

	if (typeof opts.core === 'object') {
		Object.keys(opts.core).forEach((optName) => {
			req.option(optName, opts.core[optName])
		})
	}

	const res = await req.send()

	if (res.headers.hasOwnProperty('location') && opts.followRedirects) {
		opts.url = (new URL(res.headers['location'], opts.url)).toString()

		return await httpjs(opts)
	}

	if (opts.stream) {
		res.stream = res

		return res
	}
	else {
		res.coreRes.body = res.body

		if (opts.parse) {
			if (opts.parse === 'json') {
				res.coreRes.body = await res.json()
	
				return res.coreRes
			}
			else if (opts.parse === 'string') {
				res.coreRes.body = res.coreRes.body.toString()

				return res.coreRes
			}
		}
		
		return res.coreRes
	}
}

httpjs.promisified = httpjs

httpjs.unpromisified = (opts, cb) => {
	httpjs(opts).then((data) => {
		if (cb) cb(null, data)
	}).catch((err) => {
		if (cb) cb(err, null)
	})
}

httpjs.defaults = (defaultOpts) => async (opts) => {
	const nops = typeof opts === 'string' ? {'url': opts} : opts

	Object.keys(defaultOpts).forEach((doK) => {
		if (!nops.hasOwnProperty(doK) || nops[doK] === null) {
			nops[doK] = defaultOpts[doK]
		}
	})

	return await httpjs(nops)
}

module.exports = httpjs