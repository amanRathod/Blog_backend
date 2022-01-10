const redis = require('./redis-client');

function ratelimiter({secondsWindow, allowedHits}) {
  async function ratelimiter(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.ip;

    const reqs = await redis.incr(ip);

    // expire after given(secondsWIndow) seconds\
    let timeLeft;
    if (reqs === 1) {
      await redis.expire(ip, secondsWindow);
      timeLeft = secondsWindow;
    } else {
      timeLeft = await redis.ttl(ip);
    }

    // if no.of request is more than 4 in 10 second time period, block the ip
    if (reqs > allowedHits) {
      return res.status(201).json({
        type: 'warning',
        message: 'Rate limit exceeded',
      });
    }

    req.requestCount = reqs;
    req.timeLeft = timeLeft;
    next();
  }
  return ratelimiter;
}

module.exports = ratelimiter;
