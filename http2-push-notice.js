function makePushNotice(opts){
	opts= opts|| {}
	opts.emitter= opts.emitter|| new (require('events').EventEmitter)()
	opts.push= null

	function pushNoticeHandler(req, res, cb){
		if(req.push){
			if(!opts.push){
				var push= req.push
				opts.push= function(res){
					opts.emitter.emit('push', res)
					push.call(this, res)
				}
			}
			req.push= opts.push
		}
		if(cb){
			cb()
		}
	}
	pushNoticeHandler.opts= opts
	return pushNoticeHandler
}

module.exports= makePushNotice
