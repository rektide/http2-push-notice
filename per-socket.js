function makeGroupingPushNotice(opts){
	opts= opts|| {}
	opts.socketEmitterMap= new WeakMap()
	opts.emitterType= opts.emitterType|| require('events').EventEmitter
	opts.emitter= opts.emitter|| new (opts.emitterType)()
	opts.push= null

	function groupingPushNoticeHandler(req, res, cb){
		if(!opts.map.has(req.socket)){
			var socketEmitter= new (opts.emitterType)()
			opts.socketEmitterMap.set(req.socket, socketEmitter)
			opts.emitter.emit('newSocket', req.socket, socketEmitter)
		}
		if(req.push){
			if(!opts.push){
				var push= req.push
				opts.push= function(res){
					var socketEmitter= opts.socketEmitterMap.get(this.socket)
					if(!socketEmitter){
						socketEmitter= new (opts.emitterType)()
						opts.socketEmitterMap.set(req.socket, socketEmitter)
					}
					socketEmitter.emit('push', res)
					push.call(this, res)
				}
			}
			req.push= opts.push
		}
		if(cb){
			cb()
		}
	}
	groupingPushNoticeHandler.opts= opts
	return groupingPushNoticeHandler
}

module.exports= makeGroupingPushNotice
