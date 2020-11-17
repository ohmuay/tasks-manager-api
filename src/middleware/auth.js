const jwt = require('jsonwebtoken')
const User = require('./../models/users')


const auth = async (req, res, next) => {
    // Get request token in header
    try{

        const token = req.header('Authorization').replace("Bearer ","")
        const decoded = jwt.verify(token,process.env.JWTKEY)

        // console.log(decoded); //EX {_id: 'kjh12n1lk2n521l3l1',iat:1065606 }
        const user = await User.findOne({_id:decoded._id , "tokens.token":token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        // console.log(user); //EX User Object 
        next()
    }catch(e){
        res.status(501).send("Please authenticate!")
    }
};


module.exports = auth