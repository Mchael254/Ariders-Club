import joi from 'joi'

export const userRegisterValidationSchema = joi.object({
    first_name:joi.string().required().min(2).max(30),
    last_name:joi.string().required().min(2).max(30),
    email:joi.string().email({
        minDomainSegments:2,tlds : {
            allow :['ke','com']

        }
    }),
    phone_number:joi.string().required().min(10).max(10),
    password:joi.string().required().pattern(
        new RegExp ('^[a-zA-Z0-9!@#%$&*()]{0,30}$')
    ),
    role:joi.string()
})

export const loginMemberValidationSchema = joi.object({
    email:joi.string().required().email({
        minDomainSegments:2,tlds:{
            allow:['ke','com']
        }
    }),
    password:joi.string().required()
})