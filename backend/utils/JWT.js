// utils/JWT.js

const sendToken = (user, statusCode, res) => {

    const token = user.getJwtToken()

    const rawExpiresDays = Number(process.env.COOKIE_EXPIRES_TIME)
    const expiresDays = Number.isFinite(rawExpiresDays) && rawExpiresDays > 0 ? rawExpiresDays : 7
    const isProduction = process.env.NODE_ENV === 'production'

    const options = {

        expires: new Date(
            Date.now() +
            expiresDays *
            24 * 60 * 60 * 1000
        ),

        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction
    }

    const safeStatusCode = typeof statusCode === 'number' && Number.isInteger(statusCode)
        ? statusCode
        : 200

    res
        .status(safeStatusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user
        })

}

module.exports = sendToken