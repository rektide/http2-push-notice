function makePushNotice(opts){
	opts= opts|| {}
	opts.emitterType= opts.emitterType|| require('events').EventEmitter
	opts.emitter= opts.emitter|| new (opts.emitterType)()
	opts.push= null

	function pushNoticeHandler(req, res, cb){
		if(req.push){
			if(!opts.push){
				var push= req.push
				opts.push= function(res){
					opts.emitter.emit('push', res, this.socket)
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
