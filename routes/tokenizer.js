const router = require('express').Router();
var jsonwebtoken = require('jsonwebtoken');
const privateKey = ""
 * Function generates a JaaS JWT.
 */
const generate = (privateKey, { id, name, email, avatar, appId, kid }) => {
  const now = new Date()
  const jwt = jsonwebtoken.sign({
    aud: 'jitsi',
    context: {
      user: {
        id,
        name,
        avatar,
        email: email,
        moderator: 'true'
      },
      features: {
        livestreaming: 'true',
        recording: 'true',
        transcription: 'true',
        "outbound-call": 'true'
      }
    },
    iss: 'chat',
    room: '*',
    sub: appId,
    exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
    nbf: (Math.round((new Date).getTime() / 1000) - 10)
  }, privateKey, { algorithm: 'RS256', header: { kid } })
  return jwt;
}



router.route('/').post((req,res)=>{
    const token = generate(privateKey, {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar,
        appId: req.body.appId, 
        kid: req.body.kid
    });
    
    res.send(token)

})

module.exports =router;
